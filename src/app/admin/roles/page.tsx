"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2, Shield, UserCog, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";

export interface User {
    _id: string;
    name: string;
    email: string;
    number?: string;
    role: "admin" | "staff" | "user";
    createdAt: string;
    updatedAt: string;
}

export default function AdminRolesPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        number: "",
        password: "",
        role: "staff",
    });

    const { data: currentUser } = useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const res = await fetch("/api/auth/me");
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.user;
        },
    });

    const isAdmin = currentUser?.role === "admin";

    const { data: usersData, isLoading } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const res = await fetch("/api/admin/users");
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as User[];
        },
    });

    const users = usersData || [];
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const createUserMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data;
        },
        onSuccess: () => {
            toast.success("User successfully created");
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            setIsAddUserOpen(false);
            resetForm();
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to create user");
        },
    });

    const updateUserMutation = useMutation({
        mutationFn: async (data: Partial<User>) => {
            const res = await fetch(`/api/admin/users/${selectedUser?._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data;
        },
        onSuccess: () => {
            toast.success("User details updated");
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            setIsEditUserOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update user");
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data;
        },
        onSuccess: () => {
            toast.success("User permanently deleted");
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
            setIsDeleteDialogOpen(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to delete user");
        },
    });

    const resetForm = () => {
        setFormData({ name: "", email: "", number: "", password: "", role: "staff" });
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        createUserMutation.mutate(formData);
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        updateUserMutation.mutate({
            name: formData.name,
            email: formData.email,
            number: formData.number,
            role: formData.role as any,
        });
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            number: user.number || "",
            password: "",
            role: user.role,
        });
        setIsEditUserOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Admin & Staff Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage platform access, roles and staff directory</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => { resetForm(); setIsAddUserOpen(true); }} className="w-full sm:w-auto gap-2">
                        <Plus className="w-4 h-4" /> Add User
                    </Button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-gray-50/50 dark:bg-gray-800/50"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4 font-medium">User Details</th>
                                <th className="px-6 py-4 font-medium">Contact</th>
                                <th className="px-6 py-4 font-medium text-center">Role</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                                {isAdmin && <th className="px-6 py-4 font-medium text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            Loading users...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center text-muted-foreground">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-bold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 md:hidden">
                                                        <Mail className="w-3 h-3" /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="space-y-1">
                                                <p className="flex items-center gap-2 text-muted-foreground text-xs"><Mail className="w-3.5 h-3.5" />{user.email}</p>
                                                <p className="flex items-center gap-2 text-muted-foreground text-xs"><Phone className="w-3.5 h-3.5" />{user.number || "N/A"}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <UserCog className="w-3.5 h-3.5" />}
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs hidden md:table-cell">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openEditModal(user)}>
                                                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => openDeleteModal(user)}>
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Dialog */}
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@oceanchic.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Temporary Password</Label>
                            <Input
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role Access</Label>
                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="staff">Staff (Standard Access)</SelectItem>
                                    <SelectItem value="admin">Admin (Full Control)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createUserMutation.isPending}>
                                {createUserMutation.isPending ? "Adding..." : "Add User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateUser} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@oceanchic.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                placeholder="+1 234 567 8900"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Role Access</Label>
                            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="staff">Staff (Standard Access)</SelectItem>
                                    <SelectItem value="admin">Admin (Full Control)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={updateUserMutation.isPending}>
                                {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove User Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete {selectedUser?.name}'s account. They will immediately lose access to the admin dashboard and shop settings. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteUserMutation.mutate(selectedUser!._id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {deleteUserMutation.isPending ? "Deleting..." : "Delete User"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

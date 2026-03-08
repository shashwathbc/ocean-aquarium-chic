"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Ticket, Search, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminCoupons() {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState<any>(null);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        code: "",
        discountPercentage: 10,
        startDate: "",
        endDate: "",
        isActive: true,
        usageLimit: "" as number | ""
    });

    const { data: coupons, isLoading } = useQuery({
        queryKey: ["admin", "coupons"],
        queryFn: async () => {
            const res = await fetch("/api/coupons");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    usageLimit: data.usageLimit ? Number(data.usageLimit) : null
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || "Failed to create coupon");
            return resData;
        },
        onSuccess: () => {
            toast.success("Coupon created successfully");
            setIsAddOpen(false);
            resetForm();
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
        },
        onError: (err: any) => toast.error(err.message)
    });

    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch(`/api/coupons/${data._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    usageLimit: data.usageLimit ? Number(data.usageLimit) : null
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || "Failed to update coupon");
            return resData;
        },
        onSuccess: () => {
            toast.success("Coupon updated successfully");
            setIsEditOpen(false);
            setCurrentCoupon(null);
            resetForm();
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
        },
        onError: (err: any) => toast.error(err.message)
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Coupon deleted");
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
        },
        onError: () => toast.error("Failed to delete coupon")
    });

    const resetForm = () => {
        setFormData({
            code: "",
            discountPercentage: 10,
            startDate: "",
            endDate: "",
            isActive: true,
            usageLimit: ""
        });
    };

    const handleEditClick = (coupon: any) => {
        setCurrentCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            startDate: format(new Date(coupon.startDate), "yyyy-MM-dd'T'HH:mm"),
            endDate: format(new Date(coupon.endDate), "yyyy-MM-dd'T'HH:mm"),
            isActive: coupon.isActive,
            usageLimit: coupon.usageLimit || ""
        });
        setIsEditOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentCoupon) {
            updateMutation.mutate({ ...formData, _id: currentCoupon._id });
        } else {
            createMutation.mutate(formData);
        }
    };

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ id, isActive, code, discountPercentage, startDate, endDate }: any) => {
            const res = await fetch(`/api/coupons/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive, code, discountPercentage, startDate, endDate })
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Status updated");
            queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
        }
    });

    const filteredCoupons = coupons?.filter((c: any) => c.code.toLowerCase().includes(search.toLowerCase()));

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Ticket className="w-8 h-8 text-primary" /> Coupon Codes
                </h1>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search code..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-64 bg-background"
                        />
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
                        <DialogTrigger asChild>
                            <Button className="font-bold"><Plus className="w-4 h-4 mr-2" /> Add Coupon</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Create New Coupon</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Coupon Code</Label>
                                        <Input
                                            required
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="e.g. SUMMER20"
                                            className="uppercase font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Discount %</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="100"
                                            required
                                            value={formData.discountPercentage}
                                            onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            type="datetime-local"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            type="datetime-local"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Usage Limit (Optional)</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : "" })}
                                        placeholder="Max times this can be used globally"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="space-y-0.5">
                                        <Label>Active Status</Label>
                                        <p className="text-sm text-muted-foreground">Enable or disable this coupon</p>
                                    </div>
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                                    {createMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Coupon"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>

            {/* List */}
            <Card className="border-border/50 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Valid Period</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCoupons?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No coupons found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCoupons?.map((coupon: any) => {
                                    const now = new Date();
                                    const end = new Date(coupon.endDate);
                                    const isExpired = now > end;

                                    return (
                                        <TableRow key={coupon._id} className={!coupon.isActive || isExpired ? "opacity-70 bg-muted/20" : ""}>
                                            <TableCell>
                                                <div className="font-mono font-bold bg-primary/10 text-primary px-2 py-1 rounded-md inline-block">
                                                    {coupon.code}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-bold text-lg">{coupon.discountPercentage}%</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(coupon.startDate), "MMM d, yyyy HH:mm")}</div>
                                                    <div className="text-muted-foreground text-xs">to {format(new Date(coupon.endDate), "MMM d, yyyy HH:mm")}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <span className="font-medium">{coupon.usedCount}</span>
                                                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " (Unlimited)"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={coupon.isActive && !isExpired}
                                                        disabled={isExpired}
                                                        onCheckedChange={(checked) => toggleStatusMutation.mutate({
                                                            id: coupon._id,
                                                            isActive: checked,
                                                            code: coupon.code,
                                                            discountPercentage: coupon.discountPercentage,
                                                            startDate: coupon.startDate,
                                                            endDate: coupon.endDate
                                                        })}
                                                    />
                                                    {isExpired ? (
                                                        <span className="text-xs font-semibold text-destructive flex items-center gap-1"><XCircle className="w-3 h-3" /> Expired</span>
                                                    ) : coupon.isActive ? (
                                                        <span className="text-xs font-semibold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-muted-foreground">Inactive</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleEditClick(coupon)}>
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    if (confirm("Delete this coupon forever?")) deleteMutation.mutate(coupon._id);
                                                }}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Dialog (Separate from Add to avoid form state conflicts easily) */}
            <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) { setCurrentCoupon(null); resetForm(); } }}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Coupon</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Coupon Code</Label>
                                <Input
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="uppercase font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Discount %</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="100"
                                    required
                                    value={formData.discountPercentage}
                                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Usage Limit (Optional)</Label>
                            <Input
                                type="number"
                                min="1"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : "" })}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Update Coupon"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}

"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircle, Mail, Phone, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AdminEnquiries() {
    const queryClient = useQueryClient();

    const { data: enquiries, isLoading } = useQuery({
        queryKey: ["admin", "enquiries"],
        queryFn: async () => {
            const res = await fetch("/api/enquiries");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const res = await fetch(`/api/enquiries/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (!res.ok) throw new Error("Failed to update status");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Enquiry status updated");
            queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
        },
        onError: () => {
            toast.error("Failed to update enquiry status");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Enquiry deleted");
            queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
        },
        onError: () => {
            toast.error("Failed to delete enquiry");
        }
    });

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Customer Enquiries</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enquiries?.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">No enquiries yet</h3>
                        <p className="text-sm">When customers contact you, their messages will appear here.</p>
                    </div>
                ) : (
                    enquiries?.map((enquiry: any) => (
                        <Card key={enquiry._id} className="flex flex-col border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            {enquiry.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{enquiry.email.split('@')[0]}</span> {/* Display phone extracted from our hack */}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Select
                                            defaultValue={enquiry.status}
                                            onValueChange={(val) => updateStatusMutation.mutate({ id: enquiry._id, status: val })}
                                        >
                                            <SelectTrigger className={`w-28 h-8 text-xs ${enquiry.status === 'new' ? 'border-primary/50 bg-primary/5 text-primary' :
                                                enquiry.status === 'read' ? 'border-blue-500/50 bg-blue-500/5 text-blue-600' :
                                                    'border-green-500/50 bg-green-500/5 text-green-600'
                                                }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="read">Read</SelectItem>
                                                <SelectItem value="replied">Replied</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {new Date(enquiry.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col pt-0">
                                <div className="bg-muted/50 p-4 rounded-lg flex-1 text-sm text-foreground/80 whitespace-pre-wrap border border-border/30">
                                    {enquiry.message}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this enquiry?")) {
                                                deleteMutation.mutate(enquiry._id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { getInventoryItems, getSuppliers, updateInventoryItem } from '../api/apiService';
import type { InventoryItem, Supplier } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PlaceOrderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<InventoryItem | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    // -----Form State
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
    const [orderQuantity, setOrderQuantity] = useState<number>(0);
    const [unitCost, setUnitCost] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [allItems, allSuppliers] = await Promise.all([
                    getInventoryItems(),
                    getSuppliers()
                ]);

                const foundItem = allItems.find(i => String(i.id) === id);

                if (foundItem) {
                    setItem(foundItem);
                    setSuppliers(allSuppliers);

                    
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rawItem = foundItem as any;
                    const suppId = foundItem.supplierId || rawItem.supplier_id || rawItem.supplier?.id;

                    if (suppId) {
                        setSelectedSupplierId(String(suppId));
                    }

                    setUnitCost(foundItem.unitPrice);

                    // -----Suggest quantity: (Threshold * 2) - Current or at least 50
                    const threshold = foundItem.minStockThreshold || 20;
                    const suggested = Math.max((threshold * 3) - foundItem.currentStock, threshold);
                    setOrderQuantity(suggested);
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                console.error('Failed to load order data:', err);
                setError('Failed to load item details.');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!item || !selectedSupplierId) return;

        setIsSubmitting(true);
        try {
            // ----------Update Inventory Item Stock
            const newStock = item.currentStock + orderQuantity;

            const updatedItem: Partial<InventoryItem> = {
                id: item.id,
                brandName: item.brandName,
                genericName: item.genericName,
                dosage: item.dosage,
                batchNumber: item.batchNumber,
                unitPrice: item.unitPrice,
                currentStock: newStock,
                minStockThreshold: item.minStockThreshold,
                expiryDate: item.expiryDate,
                manufacturedDate: item.manufacturedDate,
                categoryId: item.categoryId,
                supplierId: Number(selectedSupplierId),
                unit: item.unit
            };

            console.log('Sending Update Payload:', updatedItem);

            await updateInventoryItem(item.id!, updatedItem);

            alert(`Order placed successfully! Stock updated for ${item.brandName}.`);
            navigate('/inventory'); // -----Go back to inventory to see new stock

        } catch (err) {
            console.error('Failed to place order:', err);
            type AxiosErrorLike = {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };

            if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as AxiosErrorLike;
                console.error('Backend Error Response:', axiosError.response?.data);
                alert(
                    `Failed to place order: ${
                        axiosError.response?.data?.message || 'Backend rejected the request'
                    }`
                );
            } else if (err instanceof Error) {
                alert(`Failed to place order: ${err.message}`);
            } else {
                alert('Failed to place order. Check console for details.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <MainLayout activePage="Alerts">
                <div className="flex items-center justify-center h-96 text-slate-400">Loading order details...</div>
            </MainLayout>
        );
    }

    if (error || !item) {
        return (
            <MainLayout activePage="Alerts">
                <div className="flex flex-col items-center justify-center h-96 gap-4">
                    <div className="text-red-400 text-xl">{error || 'Item not found'}</div>
                    <Button onClick={() => navigate('/alerts')}>Back to Alerts</Button>
                </div>
            </MainLayout>
        );
    }

    const totalCost = orderQuantity * unitCost;

    return (
        <MainLayout activePage="Alerts">
            <div className="max-w-3xl mx-auto py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-white tracking-tight">Place Restock Order</h2>
                    {/* <Button variant="ghost" onClick={() => navigate('/alerts')} className="text-slate-400 hover:text-white">
                        Cancel
                    </Button> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Item Details Side Panel */}
                    <div className="md:col-span-1 space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg text-emerald-400">{item.brandName}</CardTitle>
                                <CardDescription>{item.genericName}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block mb-1">Current Stock</span>
                                    <span className={`text-2xl font-bold ${item.currentStock <= (item.minStockThreshold || 10) ? 'text-red-500' : 'text-slate-200'}`}>
                                        {item.currentStock}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">Dose / Unit</span>
                                    <span className="text-slate-200">{item.dosage} {item.unit}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block mb-1">Batch No</span>
                                    <span className="text-slate-200">{item.batchNumber}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Form */}
                    <div className="md:col-span-2">
                        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
                            <form onSubmit={handleConfirmOrder}>
                                <CardHeader>
                                    <CardTitle>Order Details</CardTitle>
                                    <CardDescription>Configure the purchase order details below.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    {/* Supplier Selection */}
                                    <div className="space-y-2">
                                        <Label htmlFor="supplier" className="text-slate-300">Supplier</Label>
                                        <Select
                                            value={selectedSupplierId}
                                            onValueChange={setSelectedSupplierId}
                                        >
                                            <SelectTrigger id="supplier" className="bg-slate-950 border-slate-700 text-slate-200">
                                                <SelectValue placeholder="Select Supplier" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                                {suppliers.map(sup => (
                                                    <SelectItem key={sup.id} value={String(sup.id)}>
                                                        {sup.supplierName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Quantity and Cost Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="quantity" className="text-slate-300">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="1"
                                                value={orderQuantity}
                                                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                                                className="bg-slate-950 border-slate-700 text-white focus:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cost" className="text-slate-300">Unit Cost (Rs.)</Label>
                                            <Input
                                                id="cost"
                                                type="number"
                                                step="0.01"
                                                value={unitCost}
                                                onChange={(e) => setUnitCost(Number(e.target.value))}
                                                className="bg-slate-950 border-slate-700 text-white focus:ring-emerald-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Total Calculation */}
                                    <div className="p-4 bg-slate-800/50 rounded-lg flex justify-between items-center border border-slate-700/50">
                                        <span className="text-slate-400 font-medium">Total Estimated Cost</span>
                                        <span className="text-2xl font-bold text-emerald-400">
                                            Rs. {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>

                                </CardContent>
                                <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
                                    <Button type="button" variant="ghost" onClick={() => navigate('/alerts')} className="hover:bg-slate-800 text-slate-400">
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white text-lg px-8"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm Order'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PlaceOrderPage;

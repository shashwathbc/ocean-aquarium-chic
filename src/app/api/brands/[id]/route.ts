import { NextResponse } from 'next/server';
import { brandService } from '@/services/brand.service';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const brand = await brandService.getBrandById(resolvedParams.id);
        return NextResponse.json({ success: true, data: brand }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching brand:', error);
        const status = error.message === 'Brand not found' ? 404 : 400;
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch brand' },
            { status }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const body = await request.json();
        const brand = await brandService.updateBrand(resolvedParams.id, body);
        return NextResponse.json({ success: true, data: brand }, { status: 200 });
    } catch (error: any) {
        console.error('Error updating brand:', error);
        const status = error.message === 'Brand not found' ? 404 :
            error.message === 'Invalid brand ID format' ? 400 : 500;
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update brand' },
            { status }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        await brandService.deleteBrand(resolvedParams.id);
        return NextResponse.json({ success: true, message: 'Brand deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error deleting brand:', error);
        const status = error.message === 'Brand not found' ? 404 :
            error.message === 'Invalid brand ID format' ? 400 : 500;
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete brand' },
            { status }
        );
    }
}

import { NextResponse } from 'next/server';
import { categoryService } from '@/services/category.service';

type Context = {
    params: Promise<{ id: string }>
}

export async function GET(request: Request, context: Context) {
    try {
        const params = await context.params;
        const category = await categoryService.getCategoryById(params.id);

        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        console.error('Error fetching category:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: Context) {
    try {
        const params = await context.params;
        const body = await request.json();
        const category = await categoryService.updateCategory(params.id, body);

        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: category });
    } catch (error: any) {
        console.error('Error updating category:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to update category' },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request, context: Context) {
    try {
        const params = await context.params;
        const category = await categoryService.deleteCategory(params.id);

        if (!category) {
            return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
    }
}

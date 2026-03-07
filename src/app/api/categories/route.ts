import { NextResponse } from 'next/server';
import { categoryService } from '@/services/category.service';

export async function GET() {
    try {
        const categories = await categoryService.getAllCategories();
        return NextResponse.json({ success: true, data: categories }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const category = await categoryService.createCategory(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create category' },
            { status: 400 }
        );
    }
}

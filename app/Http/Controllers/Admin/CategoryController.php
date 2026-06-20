<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * AS-02 トップ（カテゴリー一覧）を表示する。
     */
    public function index(): Response
    {
        $categories = Category::query()
            ->latest('updated_at')
            ->get(['id', 'name', 'description', 'created_at', 'updated_at']);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * カテゴリーを削除する（ON DELETE CASCADE でクイズ・選択肢も削除 / R-06）。
     */
    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('カテゴリーを削除しました。')]);
        return to_route('admin.categories.index');
    }
}

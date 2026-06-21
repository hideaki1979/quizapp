<?php

use App\Http\Controllers\Admin\CategoryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;


Route::get('/', function () {
    return redirect()->route(Auth::check() ? 'admin.categories.index' : 'login');
})->name('home');

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // AS-02 メイン画面（カテゴリー一覧）
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

require __DIR__ . '/settings.php';

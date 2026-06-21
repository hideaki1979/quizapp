import { Head, Link, router } from '@inertiajs/react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { LogoutButton } from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Category } from '@/types';

interface CategoriesIndexProps {
    categories: Category[];
}

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    // 削除確認ダイアログの対象（null のとき閉じている）
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        // ON DELETE CASCADE により所属クイズ・選択肢も削除（R-06）
        router.delete(`/admin/categories/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    };

    return (
        <>
            <Head title='カテゴリー一覧' />

            <div className='flex h-full flex-1 flex-col gap-6 p-4'>
                {/* ヘッダー: タイトル + 新規登録（AS-03 へ） */}
                <div className='flex items-center justify-between'>
                    <h1 className='text-xl font-semibold'>カテゴリー一覧</h1>
                    <div className='flex items-center gap-2'>
                        <Button asChild>
                            <Link href="/admin/categories/create">
                                <Plus className='size-4' />
                                新規登録
                            </Link>
                        </Button>
                        <LogoutButton />
                    </div>
                </div>

                {/* 一覧テーブル */}
                <div className='overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border'>
                    <table className='w-full text-sm'>
                        <thead className='bg-muted/50 text-left text-muted-foreground'>
                            <tr>
                                <th className='px-4 py-3'>ID</th>
                                <th className='px-4 py-3'>カテゴリー名</th>
                                <th className='px-4 py-3'>更新日時</th>
                                <th className='px-4 py-3'>操作</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-sidebar-border/70 dark:divide-sidebar-border'>
                            {categories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className='px-4 py-10 text-center text-muted-foreground'
                                    >
                                        カテゴリーがありません。
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className='hover:bg-muted/30'>
                                        <td className='px-4 py-3 text-muted-foreground'>
                                            {category.id}
                                        </td>
                                        <td className='px-4 py-3'>
                                            {category.name}
                                        </td>
                                        <td className='px-4 py-3 text-muted-foreground'>
                                            {dateFormatter.format(new Date(category.updated_at))}
                                        </td>
                                        <td className='px-4 py-3 text-muted-foreground'>
                                            <div className='flex items-center justify-end gap-2'>
                                                {/* 詳細（AS-04 へ） */}
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`/admin/categories/${category.id}`}>
                                                        <Eye className='size-4' />
                                                        詳細
                                                    </Link>
                                                </Button>
                                                {/* 削除（確認ダイアログを開く） */}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => setDeleteTarget(category)}
                                                >
                                                    <Trash2 className='size-4' />
                                                    削除
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 削除確認ダイアログ（カスケード削除の注意喚起） */}
            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>カテゴリーを削除</DialogTitle>
                        <DialogDescription>
                            「{deleteTarget?.name}」を削除すると、所属するクイズと選択肢も削除されます。この操作は取り消せません。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">キャンセル</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            削除する
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// 既存パターン（profile.tsx）に合わせ、AppLayout のパンくずを定義
CategoriesIndex.layout = {
    breadcrumbs: [
        {
            title: 'カテゴリー一覧',
            href: '/admin/categories',
        },
    ],
};


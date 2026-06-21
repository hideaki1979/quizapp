<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category_id', 'question', 'explanation'])]

class Quiz extends Model
{
    /** @return BelongsTo<Category, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /** @return HasMany<Option, $this> */
    public function options(): HasMany
    {
        return $this->hasMany(Option::class);
    }

    /**
     * プレイヤーの解答が正解か判定する（正解集合と完全一致のみ true / R-04・設計§6）。
     * ※プレイヤー側（PS-04）で使用。
     *
     * @param  array<int, int|string>  $selectedOptionIds  選択された選択肢IDの配列
     */
    public function isCorrectAnswer(array $selectedOptionIds): bool
    {
        $correctIds = $this->options
            ->where('is_correct', true)
            ->pluck('id')
            ->sort()
            ->values();

        $selectedIds = collect($selectedOptionIds)
            ->map(fn($id) => (int) $id)
            ->unique()
            ->sort()
            ->values();

        return $correctIds->all() === $selectedIds->all();
    }
}

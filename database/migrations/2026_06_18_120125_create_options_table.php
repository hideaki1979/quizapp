<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('options', function (Blueprint $table) {
            $table->id();
            // quizzes を参照。クイズ削除でカスケード削除（R-06）
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->string('content');
            // 正解フラグ boolean = TINYINT(1)、既定は不正解
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('options');
    }
};

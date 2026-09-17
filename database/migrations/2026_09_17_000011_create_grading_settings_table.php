<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grading_settings', function (Blueprint $table) {
            $table->id();
            $table->decimal('passing_grade', 5, 2)->default(75.00);
            $table->decimal('prelim_weight', 5, 2)->default(30.00);
            $table->decimal('midterm_weight', 5, 2)->default(30.00);
            $table->decimal('final_weight', 5, 2)->default(40.00);
            $table->string('grading_system')->default('percentage'); // percentage (0-100), point (1.0-5.0)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grading_settings');
    }
};


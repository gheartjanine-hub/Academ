<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "BSIT-1A"
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            $table->string('year_level'); // "1st Year", "2nd Year", etc.
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->foreignId('adviser_id')->nullable()->constrained('teachers')->nullOnDelete();
            $table->integer('max_students')->default(40);
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};


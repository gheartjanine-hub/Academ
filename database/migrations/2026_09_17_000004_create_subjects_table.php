<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. "IT101"
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('units')->default(3);
            $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            $table->string('department')->nullable();
            $table->string('year_level')->nullable(); // "1st Year", "2nd Year", etc.
            $table->string('semester')->nullable(); // "1st Semester", "2nd Semester", "Summer"
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};


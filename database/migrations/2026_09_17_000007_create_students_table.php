<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('student_id')->unique(); // e.g. "STD-2026-0001"
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable(); // Male, Female, Other
            $table->text('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('email')->unique();
            $table->foreignId('program_id')->nullable()->constrained('programs')->nullOnDelete();
            $table->string('year_level')->nullable(); // "1st Year", "2nd Year", "3rd Year", "4th Year"
            $table->foreignId('section_id')->nullable()->constrained('sections')->nullOnDelete();
            $table->foreignId('academic_year_id')->nullable()->constrained('academic_years')->nullOnDelete();
            $table->string('status')->default('active'); // active, inactive, graduated, dropped
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};


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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('name')->nullable()->after('user_id');
            $table->text('description')->nullable()->after('subscription_name');
            $table->decimal('price', 10, 2)->default(0)->after('description');
            $table->json('features')->nullable()->after('price');
            $table->json('specifications')->nullable()->after('features');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('description');
            $table->dropColumn('price');
            $table->dropColumn('features');
            $table->dropColumn('specifications');
        });
    }
};

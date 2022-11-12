<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'order_items';
    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'status',
        'price',
        'notes',
        'custom',
        '$order_id',
        '$order_local_number',
        '$product_id',
        '$preparation_by'
    ];

    public function product() {
        return $this->belongsTo(Product::class, 'product_id', 'id')->withTrashed();
    }

    public function order() {
        return $this->belongsTo(Order::class, 'order_id', 'id')->withTrashed();
    }

    public function preparation_by() {
        return $this->belongsTo(User::class, 'preparation_by', 'id')->withTrashed();
    }
}

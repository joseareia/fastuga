<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\OrderResource;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Customer;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->input('status') == -1 ? Order::paginate(20) : Order::where('status', $request->input('status'))->paginate(20);
        return OrderResource::collection($orders);
    }

    public function getOrdersOfUser($id)
    {
        $orders = Order::where('customer_id', $id)->paginate(20);
        return OrderResource::collection($orders);
    }

    public function store(StoreOrderRequest $request)
    {
        $latest_ticket = Order::select('ticket_number')->latest('id')->whereDate('created_at', Carbon::today())->first()->ticket_number;

        $order = new Order;
        $order->fill($request->validated());
        $order->ticket_number = $latest_ticket >= 99 ? 1 : ++$latest_ticket;
        $order->status = "P";

        // TODO: Handle Payments & Points

        $order->save();

        return new OrderResource($order);
    }

    public function show(Order $order)
    {
        return new OrderResource($order);
    }

    public function update(StoreOrderRequest $request, Order $order)
    {
        $order->fill($request->validated());
        $order->save();
        return new OrderRequest($order);
    }

    public function destroy($id) // -> Boolean Return
    {
        return DB::transaction(function () use ($id) {
            $order = Order::where('id', $id)->firstOrFail();
            if ($order->customer) { $order->customer()->detach(); }
            if ($order->delivered_by) { $order->delivered_by_user()->detach(); }
            return $order->delete();
        });
    }

    /* --- Custom Routes --- */

    public function status(Request $request, $id) // -> Change Order Status
    {
        $request->validate(['status' => 'required|in:P,R,D,C']);
        $order = Order::where('id', $id)->firstOrFail();
        $order->status = $request->input('status');
        $order->save();
        return new OrderResource($order);
    }

    public function get_orders_customer(Customer $customer) // -> Get Orders From Customer
    {
        $orders = Order::where('customer_id', $customer->id)->get();
        return OrderResource::collection($orders);
    }
}

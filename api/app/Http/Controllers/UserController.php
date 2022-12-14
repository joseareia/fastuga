<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\CustomerResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index(Request $request)
    {
        /* --- Authorization --- */
        if (Auth()->guard('api')->user()->type != "EM") { abort(403); }
        $users = $request->type != 'all' ? User::where('type', $request->input('type'))->paginate(10) : User::paginate(10);
        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request)
    {
        /* --- Authorization --- */
        if ($request['type'] != 'C' && Auth()->guard('api')->user()->type != "EM") { abort(403); }

        $new_user = DB::transaction(function () use ($request) : User {
            $user = new User;
            $user->fill($request->validated());
            $password_hashed = Hash::make($request->input('password'));
            $user->password = $password_hashed;
            if ($request->has('photo_url')) {
                $image_id = Str::random(15) . "." . explode('/', explode(';', $request->input('photo_url'))[0])[1];
                Storage::put("public/fotos/" . $image_id, base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $user->photo_url)));
                $user->photo_url = $image_id;
            }
            $user->save();
            return $user;
        });

        return new UserResource($new_user);
    }

    public function show(User $user)
    {
        /* --- Authorization --- */
        if ((!Auth()->guard('api')->user()->type == "EM") && (Auth()->guard('api')->user()->type !="EM" && Auth()->guard('api')->user()->id!=$user->id) ) { abort(403); }
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        /* --- Authorization --- */
        if((Auth()->guard('api')->user()->type != "EM") && (Auth()->guard('api')->user()->id!=$user->id)) { abort(403); }
        $user->fill($request->validated());

        if ($request->has('photo_url')) {
            $image_id = Str::random(15) . "." . explode('/', explode(';', $request->input('photo_url'))[0])[1];
            Storage::put("public/fotos/" . $image_id, base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $user->photo_url)));
            $user->photo_url = $image_id;
        }

        $user->save();
        return new UserResource($user);
    }

    public function destroy($id) // -> Boolean Return
    {
        /* --- Authorization --- */
        if (Auth()->guard('api')->user()->type != "EM") { abort(403); }
        return DB::transaction(function () use ($id) {
            $user = User::where(['id' => $id], ['deleted_at' => null])->firstOrFail();
            if ($user->customer) { $user->customer->delete(); }
            return $user->delete();
        });
    }

    /* --- Custom Routes --- */

    public function show_me(Request $request) { return new UserResource($request->user()); }

    public function toogle($id) {
        /* --- Authorization --- */
        if (Auth()->guard('api')->user()->type != "EM") { abort(403); }
        $user = User::where(['id' => $id], ['deleted_at' => null])->firstOrFail();
        $user->blocked = $user->blocked == 1 ? 0 : 1;
        $user->save();
        return new UserResource($user);
    }

    public function new_password(UpdateUserPasswordRequest $request, User $user) {
        if (Auth()->guard('api')->user()->id != $user->id ) { abort(403); }

        $user = User::where(['id' => $user->id], ['deleted_at' => null])->firstOrFail();
        $password_hashed = Hash::make($request->input('password'));
        $user->password = $password_hashed;
        $user->save();
        return new UserResource($user);
    }

}

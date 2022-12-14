<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required',
            'email' => ['required', 'email', Rule::unique('users')->ignore($this->user)],
            'password' => 'required|min:8',
            'type' => 'required|in:C,EC,ED,EM',
            'blocked' => 'required|in:0,1',
            'photo_url' => 'nullable',
            'custom' => 'nullable'
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'The e-mail is already registered. Please, try choose another one.'
        ];
    }
}

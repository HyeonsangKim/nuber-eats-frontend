import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import { Button } from "../components/button";
import { useHistory, Link } from "react-router-dom";
import { UserRole } from "../__generated__/globalTypes";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    formState,
    formState: { errors },
    handleSubmit,
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      // redirect
      alert("Account Created! Log in now!");
      history.push("/");
    }
  };

  const [
    createAccountMutation,
    { loading, data: createAccountMutationResult },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>CreateAccount | Nuber Eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img
          src='https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg'
          className='w-52 mb-10'
        />
        <h4 className='w-full font-medium text-left text-3xl mb-5'>
          Let's get started
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 w-full mb-5'
        >
          <input
            className='input'
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name='email'
            type='email'
            placeholder='Email'
          />
          {errors.email?.message && (
            <span className='font-medium text-red-500'>
              <FormError errorMessage={errors.email?.message} />
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className='font-medium text-red-500'>
              <FormError errorMessage={"Please enter a valid email"} />
            </span>
          )}
          <input
            {...register("password", {
              required: "Password is required",
              //minLength: 10,
            })}
            name='password'
            type='password'
            placeholder='password'
            className='input'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage=' Password must be more than 10 chars.' />
          )}
          <select
            {...register("role", { required: true })}
            className='input'
            name='role'
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText='Create Account'
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to='/' className='text-lime-600 hover:underline'>
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;

'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TextInput, Button, Group, Box, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'

import { AnonOnly, FacebookButton } from '@/app/components/Auth'
import { notifications } from '@mantine/notifications'

const schema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters'
    })
  })
  .refine(
    ({ passwordConfirmation, password }) => passwordConfirmation !== password,
    {
      message: "Passwords don't match",
      path: ['passwordConfirmation']
    }
  )

export default function Register () {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: ''
    },
    validate: zodResolver(schema)
  })
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRegister = async ({ email, password }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) {
        throw new Error(error.message)
      }
      router.refresh()
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error registering, please try again',
        message: error.message
      })
    }
  }

  return (
    <AnonOnly>
      <Box maw={340} mx="auto" mt="25vh">
        <form onSubmit={form.onSubmit(handleRegister)}>
          <TextInput
            required
            label="Email"
            type="email"
            name="email"
            {...form.getInputProps('email')}
          />
          <TextInput
            required
            type="password"
            label="Password"
            name="password"
            {...form.getInputProps('password')}
          />
          <TextInput
            required
            type="password"
            label="Confirm Password"
            name="passwordConfirmation"
            {...form.getInputProps('passwordConfirmation')}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
            >
              Register
            </Button>
          </Group>
        </form>
        <FacebookButton />
        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Link
            style={{
              textDecoration: 'underline',
              color: 'blue'
            }}
            href={'/login'}
          >
            Login here
          </Link>
        </Text>
      </Box>
    </AnonOnly>
  )
}

import { useQuery } from '@tanstack/react-query'

export const useListContacts = (supabase) => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name', { ascending: true })
      if (error) {
        throw new Error(error.message ?? 'Error fetching contacts')
      }
      return data
    },
    retry: false

  })
}

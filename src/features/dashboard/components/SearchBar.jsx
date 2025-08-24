import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Search } from 'lucide-react'

export default function SearchBar({ search, setSearch }) {
  return (
    <section className="mb-6">
      <div className="flex gap-2 items-center">
        <Input 
          placeholder="Search queries or responses..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="bg-white border border-gray-200" 
        />
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-amber-50"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

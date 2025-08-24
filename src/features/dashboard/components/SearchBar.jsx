import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Search } from 'lucide-react'

export default function SearchBar({ search, setSearch }) {
  return (
    <section className="mb-6" aria-label="Search logs">
      <div className="flex gap-2 items-center">
        <Input 
          placeholder="Search queries or responses..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="bg-white border border-gray-200" 
          aria-label="Search logs by user queries or model responses"
          aria-describedby="search-description"
          role="searchbox"
        />
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-amber-50"
          aria-label="Search logs"
          aria-describedby="search-button-description"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </Button>
        <span id="search-description" className="sr-only">
          Enter keywords to search through log entries by user queries or AI model responses
        </span>
        <span id="search-button-description" className="sr-only">
          Click to perform the search
        </span>
      </div>
    </section>
  )
}

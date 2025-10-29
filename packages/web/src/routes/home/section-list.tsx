import { Button } from '@mints/ui';
import { Link } from 'react-router';

import type { ISection } from '@/api/section';

interface Props {
  sections: ISection[];
}

export function SectionList({ sections }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-center gap-1 overflow-x-auto scrollbar-hide py-2">
        {sections.map((section) => (
          <Link to={`/s/${section.id}/topics`} key={section.id}>
            <Button variant="link" size="sm">
              {section.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}

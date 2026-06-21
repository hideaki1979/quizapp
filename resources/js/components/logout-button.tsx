import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';

export function LogoutButton() {
    return (
        <Button asChild variant="outline" size="sm">
            <Link
                href={logout()}
                as="button"
                onClick={() => router.flushAll()}
                data-test="logout-button"
            >
                <LogOut className='size-4' />
                ログアウト
            </Link>
        </Button>
    )
}

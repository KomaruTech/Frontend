import { Providers } from './providers';
import { AppRouter } from './router';

export const Application = () => {
    return (
        <Providers>
            <AppRouter />
        </Providers>
    );
};
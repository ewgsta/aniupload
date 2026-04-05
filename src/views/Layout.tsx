import type { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>AniUpload Panel</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 min-h-screen text-gray-800">
                <header class="bg-indigo-600 text-white p-4 shadow-md">
                    <div class="container mx-auto flex justify-between items-center">
                        <h1 class="text-2xl font-bold">AniUpload Panel</h1>
                        <nav>
                            <a href="/" class="hover:text-indigo-200 mr-4">Dashboard</a>
                            <a href="/settings" class="hover:text-indigo-200">Settings</a>
                        </nav>
                    </div>
                </header>
                <main class="container mx-auto p-4 mt-6">
                    {props.children}
                </main>
            </body>
        </html>
    );
};

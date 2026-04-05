import type { FC } from 'hono/jsx';

export const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>AniUpload Panel</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/css/base.css" />
            </head>
            <body>
                <header class="header">
                    <div class="container header-content">
                        <h1 class="header-title">AniUpload Panel</h1>
                        <nav>
                            <a href="/" class="nav-link">Dashboard</a>
                            <a href="/settings" class="nav-link">Settings</a>
                        </nav>
                    </div>
                </header>
                <main class="container main-content">
                    {props.children}
                </main>
            </body>
        </html>
    );
};

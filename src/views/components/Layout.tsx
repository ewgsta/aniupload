import type { FC } from 'hono/jsx';

import { html } from 'hono/html';

export const Layout: FC<{ title?: string; children?: any }> = (props) => {
    return (
        <html lang="tr">
            <head>
                <title>{props.title || 'AniUpload'}</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/css/base.css" />
            </head>
            <body>
                {props.children}
                {html`
                <script>
                    document.addEventListener("DOMContentLoaded", () => {
                        const toasts = document.querySelectorAll('.toast');
                        toasts.forEach(toast => {
                            setTimeout(() => {
                                toast.classList.add('hide');
                                setTimeout(() => toast.remove(), 400);
                            }, 3000);
                        });
                    });
                </script>
                `}
            </body>
        </html>
    );
};

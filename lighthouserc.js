export const ci = {
    collect: {
        staticDistDir: './dist',
        url: [
            'http://localhost/index.html',
            'http://localhost/speaking.html',
            'http://localhost/2025.html',
            'http://localhost/2025/04/azure-function-isolated.html'
        ]
    },
    upload: {
        target: 'temporary-public-storage',
    },
};
'use client';

export default function Footer() {
    return (
        <footer className="mt-auto py-4 px-6 border-t border-white/10 bg-slate-900/50">
            <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-slate-400">
                    Designed with <span className="text-red-500">❤️</span> for{' '}
                    <span className="text-white font-medium">Krishna Vishwa Vidyapeeth</span>{' '}
                    <span className="text-slate-500">("Deemed to be University")</span>, Karad
                </p>
                <p className="text-xs text-slate-500">
                    Developed by <span className="text-blue-400">Mayur More</span>, IT Manager - Krishna Vishwa Vidyapeeth ("Deemed to be University")
                </p>
            </div>
        </footer>
    );
}

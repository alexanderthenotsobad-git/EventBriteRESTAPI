import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development',
    entry: './app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        // Alias the main library AND its internal dependencies
        alias: {
            '@toast-ui/calendar': path.resolve(__dirname, 'node_modules/@toast-ui/calendar/dist/toastui-calendar.mjs'),
            'tui-date-picker': path.resolve(__dirname, 'node_modules/tui-date-picker/dist/tui-date-picker.js'),
            'tui-time-picker': path.resolve(__dirname, 'node_modules/tui-time-picker/dist/tui-time-picker.js')
        }
    },
    devtool: 'source-map'
};
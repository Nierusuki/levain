import * as path from "https://deno.land/std/path/mod.ts";
import y18n from "https://deno.land/x/y18n/deno.ts";

const i18n = y18n({
    locale: 'pt_BR',
    directory: path.resolve(path.dirname(path.fromFileUrl(import.meta.url)), '../../locales')
});

export var __ = i18n.__

export class I18N {
    static setup(locale: string) {
        if (locale) {
            i18n.setLocale(locale);
        }
    }
}

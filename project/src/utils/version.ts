export class Options {
    step: number;
    format: string;
    version: number;
    release: number;
    patch: number;
    patchify: boolean;
}

export class Version {

    step: number;
    format: string;
    version: number;
    release: number;
    patch: number;
    _previousVersions: Array<string>;
    _type: string;

    constructor (options: Options = new Options()) {
        this.step = options.step !== undefined ? options.step : 1;
        this.format = options.format !== undefined ? options.format : "@v.@r.@p";
        this.version = options.version !== undefined ? options.version : 0;
        this.release = options.release !== undefined ? options.release : 0;
        this.patch = options.patch !== undefined ? options.patch : 0;

        this._previousVersions = [];
        this._type = 'VERSION';
    }

    is(): string {
        return this.format
            .replace(/@v/, this.version.toString())
            .replace(/@r/, this.release.toString())
            .replace(/@p/, this.patch.toString());
    }

    nextMinorVersion (): void {
        this._previousVersions.push(this.is());
        this.release++;
        this.patch = 0;
    }

    nextPatch (): void {
        this._previousVersions.push(this.is());
        this.patch++;
    }

    nextVersion (): void {
        this._previousVersions.push(this.is());
        this.version++;
        this.release = 0;
        this.patch = 0;
    }

    getPrevious(): Object {
        return JSON.parse(JSON.stringify(this._previousVersions));
    }
}

export function short(v: number, r: number, p: number): Version {
    let _options = new Options();
    _options.version = v;
    _options.release = r;
    _options.patch = p;

    return new Version(_options);
}
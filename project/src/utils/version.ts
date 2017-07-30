export class Options {
    step: number = 1;
    format: string = "@v.@r.@p";
    version: number = 0;
    release: number = 0;
    patch: number = 0;
    patchify: boolean = false;

    constructor() {
        Object.seal(this);
    }
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
        let op = new Options();
        Object.assign(op, options);
        this.step = options.step;
        this.format = options.format;
        this.version = options.version;
        this.release = options.release;
        this.patch = options.patch;

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

export function Short(v: number, r: number, p: number): Version {
    let _options = new Options();
    _options.version = v;
    _options.release = r;
    _options.patch = p;

    return new Version(_options);
}
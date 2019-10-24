export interface PresetData {
    preset: string;
}

declare const presetData: PresetData;

export function getPresetData(): PresetData {
    return presetData;
}

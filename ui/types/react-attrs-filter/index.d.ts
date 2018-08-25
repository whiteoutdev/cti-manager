interface Props {
    [key: string]: any
}

export function getPropsFor(tag: string): string;

export function filterPropsFor(props: Props, tag: string): Props;

export function filterPropsExcept(props: Props, tag: string): Props;

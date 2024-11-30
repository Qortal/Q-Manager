import { useRef, useState } from 'react';

interface State {
    isShow: boolean;
}
export const useModal = () => {
    const [state, setState] = useState<State>({
        isShow: false,
    });
    const [type, setType] = useState('');
    const promiseConfig = useRef<any>(null);
    const show = async (data) => {
        setType(data)
        return new Promise((resolve, reject) => {
            promiseConfig.current = {
                resolve,
                reject,
            };
            setState({
                isShow: true,
            });
        });
    };

    const hide = () => {
        setState({
            isShow: false,
        });
        setType('')
    };

    const onOk = (payload:any) => {
        const { resolve } = promiseConfig.current;
        setType('')

        hide();
        resolve(payload);
    };

    const onCancel = () => {
        const { reject } = promiseConfig.current;
        hide();
        reject();
        setType('')

    };
    return {
        show,
        onOk,
        onCancel,
        isShow: state.isShow,
        type
    };
};
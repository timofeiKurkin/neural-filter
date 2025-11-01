import React, {FC} from "react";
import Image from "next/image";

import styles from "./CheckBox.module.scss"

type propType = {
    initialStateCheckBox: boolean
    setCheckBoxState: React.Dispatch<React.SetStateAction<boolean>>
}

const CheckBox: FC<propType> = ({initialStateCheckBox, setCheckBoxState}) => {

    return (
        <div className={styles.checkBoxWrapper}
             onClick={() => setCheckBoxState((prev) => (!prev))}
        >
            {initialStateCheckBox &&
                <div className={styles.checkBoxMark}>
                    <div className={styles.checkBoxMarkWrapper}>
                        <Image src={"/form/check-mark.svg"} unoptimized alt={"check mark"} width={10} height={9} quality={100}/>
                    </div>
                </div>
            }

            <input type="checkbox"
                   defaultChecked={initialStateCheckBox}
                   className={styles.checkBox}/>
        </div>

    );
};

export default CheckBox;
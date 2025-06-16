import { getEle } from "../controllers/main.js";

class Validation {
    CheckEmpty(value, idNoti, message) {
        if (value === "") {
            getEle(idNoti).innerHTML = message;
            getEle(idNoti).style.display = "block";
            return false;
        }

        getEle(idNoti).innerHTML = "";
        getEle(idNoti).style.display = "none";
        return true;
    }

    checkCharacterLength(value, idNoti, message, min, max) {
        if (min <= value.trim().length <= max) {
            getEle(idNoti).innerHTML = "";
        getEle(idNoti).style.display = "none";
        return true;
            
        }


        getEle(idNoti).innerHTML = message;
            getEle(idNoti).style.display = "block";
            return false;
    }

    checkString(value, idNoti, message) {
        const letter = "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
        if (value.match(letter)) {
            getEle(idNoti).innerHTML = "";
            getEle(idNoti).style.display = "none";
            return true;
        }

        getEle(idNoti).innerHTML = message;
        getEle(idNoti).style.display = "block";
        return false;
    }

    checkNumber(value, idNoti, message) {
        const letter = /^[0-9]+$/
        if (value.match(letter)) {
            getEle(idNoti).innerHTML = "";
            getEle(idNoti).style.display = "none";
            return true;
        }

        getEle(idNoti).innerHTML = message;
        getEle(idNoti).style.display = "block";
        return false;
    }

    checkSelectOption(idSelect, idNoti, message) {
        if (getEle(idSelect).selectedIndex !== 0) {
            getEle(idNoti).innerHTML = "";
            getEle(idNoti).style.display = "none";
            return true;
        }

        getEle(idNoti).innerHTML = message;
        getEle(idNoti).style.display = "block";
        return false;
    }
}

export default Validation;
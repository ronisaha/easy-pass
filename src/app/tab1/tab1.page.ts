import {Component} from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import {Clipboard} from "@capacitor/clipboard";
import {addIcons} from "ionicons";
import {copy, key} from "ionicons/icons";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonCheckbox, IonIcon, IonLabel, FormsModule, IonButton, NgIf],
})
export class Tab1Page {
  passwordLength: number = 12;
  bSymbol: boolean = true;
  bNumber: boolean = true;
  bLower: boolean = true;
  bUpper: boolean = true;
  bBeginLatter: boolean = true;
  bNoSimilar: boolean = true;
  bAllUnique: boolean = true;
  bNoSequential: boolean = true;
  totalSet: string = '';
  password: string = ''
  error: string = '';
  private lowerLatterSet: string = '';
  private upperLatterSet: string = '';
  customSymbolSet: string = '~!@#$%^&*(){|}[]_+=-<>?/\':;",.`';
  private numberSet: string = '';
  private symbolSet: string = '';
  private nSetNumber = 0;

  constructor(private toastController: ToastController) {
    addIcons({copy, key});
    this.updateSet();
    this.generate();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
    });

    await toast.present();
  }

  copy() {
    Clipboard.write({string: this.password}).then(() => {
      this.presentToast("Password Copied to clip board!").then(() => {
        //Copied
      });
    })
  }

  updateSet() {
    this.password = '';
    this.nSetNumber = 0;
    this.numberSet = '23456789';
    this.lowerLatterSet = 'abcdefghjkmnpqrstuvwxyz';
    this.upperLatterSet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    this.symbolSet = this.customSymbolSet;
    if( !this.bNoSimilar )
    {
     this.lowerLatterSet	+="ilo";
      this.upperLatterSet	+="IO";
      this.numberSet+="01";
    }
    else
    {
      if( this.bSymbol )
        this.symbolSet = this.symbolSet.replace('|','');
    }

    this.totalSet = '';

    if (this.bSymbol) {
      this.totalSet = this.symbolSet;
      this.nSetNumber++;
    }

    if (this.bNumber) {
      this.totalSet += this.numberSet;
      this.nSetNumber++;
    }

    if (this.bLower) {
      this.totalSet += this.lowerLatterSet;
      this.nSetNumber++;
    }

    if (this.bUpper) {
      this.totalSet += this.upperLatterSet;
      this.nSetNumber++;
    }

    this.validate()
  }

  validate(): void {
    if (this.nSetNumber == 0) {
      this.error = 'You must select at least one character set!';
      return;
    }

    if(this.bAllUnique && this.passwordLength > this.totalSet.length) {
      this.error = 'No enough character sets selected.';
      return;
    }

    if(this.bBeginLatter && !this.bLower && !this.bUpper) {
      this.error = 'No Lowercase or Uppercase letters selected. But Do not begin with number or symbol option selected'
      return;
    }

    this.error = '';
  }

  insertChar(szCharSet: string, nBufferLength: number, szBuffer: string) {
    let nPos;
    let nInsertPos;
    let szSwap;
    const bAllUnique = this.bAllUnique;
    if (!bAllUnique) {
      nPos = 0;
      nInsertPos = 0;

      const array1 = new Uint32Array(1);
      // @ts-ignore
      nPos = crypto.getRandomValues(array1) % (szCharSet.length);

      const array2 = new Uint32Array(1);
      // @ts-ignore
      nInsertPos = crypto.getRandomValues(array2) % (nBufferLength);


      szSwap = szBuffer.substring(0, nInsertPos) + szCharSet.substring(nPos, nPos + 1) + szBuffer.substring(nInsertPos, nBufferLength);
      szBuffer = szSwap;
      return szBuffer;
    }

    szSwap = "";
    let szCharSetCopy = szCharSet;

    const today1 = new Date();
    const s1 = today1.getSeconds();


    while (true) {
      const today2 = new Date();
      const s2 = today2.getSeconds();
      if (s2 - s1 >= 2) {
        break;
      }

      if (szCharSetCopy.length == 0) {
        break;
      }
      nPos = 0;


      const array3 = new Uint32Array(1);
      // @ts-ignore
      nPos = crypto.getRandomValues(array3) % (szCharSetCopy.length);


      const szNewTmp = szCharSetCopy.substring(nPos, nPos + 1);
      const nTmp = szBuffer.indexOf(szNewTmp);

      if (nTmp == -1) {
        nInsertPos = 0;

        const array4 = new Uint32Array(1);
        // @ts-ignore
        nInsertPos = crypto.getRandomValues(array4) % nBufferLength;
        szSwap = szBuffer.substring(0, nInsertPos) + szNewTmp + szBuffer.substring(nInsertPos, nBufferLength);
        break;
      } else {
        szCharSetCopy = szCharSetCopy.replace(szNewTmp, '');
      }
    }

    szBuffer = szSwap;
    return szBuffer;
  }

  generate() {
    let nAllLength = this.totalSet.length;
    let szBuffer = "";
    let nBufferLength = this.passwordLength - this.nSetNumber
    if(!this.bAllUnique) {
      for (let i = 0; i < nBufferLength; i++) {
        let nPos = 0;
        const array5 = new Uint32Array(1);
        // @ts-ignore
        nPos = crypto.getRandomValues(array5) % nAllLength;
        szBuffer += this.totalSet.substring(nPos, nPos + 1);
      }
    }else{
      let szAllCopy = this.totalSet;
      let bStop = false;
      for (let i = 0; i < nBufferLength && !bStop; i++) {
        const today = new Date();
        const s1 = today.getSeconds();

        while (true) {
          const today2 = new Date();
          const s2 = today2.getSeconds();
          if (s2 - s1 >= 2) {
            break;
          }

          const nAllLengthLeft = szAllCopy.length;
          if (nAllLengthLeft == 0) {
            bStop = true;
            break;
          }

          let nPos = 0;

          const array6 = new Uint32Array(1);
          // @ts-ignore
          nPos = crypto.getRandomValues(array6) % nAllLengthLeft;

          const strNewTmp = szAllCopy.substring(nPos, nPos + 1);
          const nTmp = szBuffer.indexOf(strNewTmp);

          if (nTmp == -1) {
            szBuffer += strNewTmp;
            break;
          } else {
            szAllCopy = szAllCopy.replace(strNewTmp, '');
          }
        }
      }

    }

    if (this.bUpper) {
      szBuffer = this.insertChar(this.upperLatterSet, nBufferLength, szBuffer)
      nBufferLength++;
    }

    if (this.bLower) {
      szBuffer = this.insertChar(this.lowerLatterSet, nBufferLength, szBuffer)
      nBufferLength++;
    }

    if (this.bNumber) {
      szBuffer = this.insertChar(this.numberSet, nBufferLength, szBuffer)
      nBufferLength++;
    }

    if (this.bSymbol)
      szBuffer = this.insertChar(this.symbolSet, nBufferLength, szBuffer)


    if (this.bNoSequential) {
      let bSeq = false;
      for (let j = 0; j < szBuffer.length - 1; j++) {
        const n1 = szBuffer.charCodeAt(j);
        const n2 = szBuffer.charCodeAt(j + 1);

        if ((n2 - n1 == 1) && ((n1 >= 48 && n1 <= 56) || (n1 >= 65 && n1 <= 89) || (n1 >= 97 && n1 <= 121))) {
          bSeq = true;
          szBuffer = "ERR";
          break;
        }
      }
    }

    if (this.bBeginLatter) {
      const n3 = szBuffer.charCodeAt(0);
      let bBeginWithC = false;
      if ((n3 >= 65 && n3 <= 90) || (n3 >= 97 && n3 <= 122))
        bBeginWithC = true;
      if (!bBeginWithC)
        szBuffer = "ERR";
    }

    if(szBuffer === 'ERR') {
      this.generate();
      return;
    }

    this.password = szBuffer;
  }
}

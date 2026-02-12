import { BrandName } from "./brands";

export const wording = {
  welcomeToEbooks: {
    en: "Welcome to eBooks+",
    de: "Willkommen bei eBooks+",
    es: "Bienvenido/a a eBooks+",
    jp: "eBooks+へようこそ"
  },
  welcomeToYourLibrary: {
    en: "Welcome to your content library",
    de: "Willkommen in Ihrer Bibliothek",
    es: "Bienvenido/a a tu biblioteca de contenido",
    jp: "コンテンツ・ライブラリーへようこそ"
  },
  signOut: "Sign out",
  redeemAccessCodeErrorMessage: {
    alreadyRedeemed:
      "The access code you entered has already been redeemed. Visit our Customer Support (opens in a new window) if you need additional assistance.",
    notRecognized:
      "Sorry, this code is not recognized. Visit our Customer Support (opens in a new window) if you need additional assistance.",
    userIsAlreadyEntitledToContent: "User is already entitled to this content.",
    invalidFormatOrAlreadyRedeemed:
      "Sorry, this code has invalid format or was already redeemed. Visit our Customer Support (opens in a new window) if you need additional assistance."
  },
  accessCodeHelp: {
    alreadyHaveAccess: "You already have access to this content.",
    requestReceived: "Your request has been received.",
    notAbleToProcessRequest:
      "We are not able to process your request. Visit Customer Support (opens in a new window) for help."
  },
  redeemAdditionalContent: {
    orderNumberSuccess: "Order Number successful",
    notAbleToProcessRequest:
      "We are not able to process your request. Visit Customer Support (opens in a new window) for help."
  },
  updateUserStatus: {
    noFileSelected: "No file selected.",
    importCompleted: "Import Completed"
  },
  grantPermission: {
    selectBrand: "Please select Brand",
    pleaseWait: "Please wait while permissions are being processed.",
    permissionGranted: "Permission successfully granted.",
    invalidISBNFormat: "Error: Invalid ISBN",
    userDoesNotHaveEntitlements: "This user does not have any entitlements",
    bookNotFound: "Book not found"
  },
  createAccessCode: {
    yourRequestCouldNotBeProcessed:
      "Your request could not be processed. Please enter the ISBN again.",
    requestIsLimited: "Request is limited to 5000"
  },
  searchAccessCode: {
    codeNotFound: "Access Code not found",
    invalidCode: "Error: Invalid Access Code"
  },
  manageAdmins: {
    invalidEmail: "Invalid email. Please confirm user is registered.",
    invalidElsevierEmail: "Invalid email. An Elsevier email address is required."
  },
  somethingWentWrongMessage: "Something went wrong, please check the page again later.",
  importAccessCodes: {
    templateFileName: "ACCESS_CODE_CSV_TEMPLATE.csv",
    fileSizeAlert:
      "The size of the CSV file must be max 5MB. If the size exceeds 5MB, do divide into multiple CSV files"
  },
  userSearch: {
    enterValidEmail: "Please enter a valid email address"
  },
  successMigrationMessage:
    "The title is successfully added to your Library. Navigate to Home page to access it or continue migration.",
  successRemovingMessage:
    "The title is successfully removed. Navigate to Home page or continue migration.",
  removeNonMigratedEntitlementConfirmation:
    "The title will be removed from the list and this action cannot be reverted. Are you sure you want to remove it?",
  contentItemError: {
    imageUnavailable: "The image is unavailable.",
    videoUnavailable: "The video is unavailable.",
    audioUnavailable: "The audio is unavailable."
  },
  migration: {
    weAreMigratingYourLibrary: {
      en: "Information:We’re migrating your library",
      ja: "Information:Elsevier eLibraryからの書籍データの移行作業中です。"
    },
    yourLibraryWasMigrated: {
      en: "Information:Your library was successfully migrated!Close",
      ja: "Information:Elsevier eLibraryからの書籍データの移行は完了しています。Close"
    }
  }
};

export const orderNumberAlreadyUsed = (orderNumber: string) => {
  return `The order number ${orderNumber} has already been used`;
};

export const userIsAlreadyEntitledToContentISBN = (isbn: string) => {
  return `User is already entitled to content: ${isbn}`;
};

export const grantPermissionConfirmation = (brand: BrandName) => {
  return `If you confirm, the user will be notified by email that they can access the book content on ${brand}`;
};

export const grantPermissionError = (isbn: string) => {
  return `User is already entitled to content: ${isbn}`;
};

export const grantPermissionNonElsevierError = (isbn: string) => {
  return `Entitlement request already exists for content: ${isbn}, and was approved`;
};

export const grantPermissionModalHeading = (isbn: string) => {
  return `Grant Permission for ISBN ${isbn}`;
};

export const requestFailedStatus = (statusCode: number) => {
  return `Request failed with status code ${statusCode}`;
};

export const importProcessCompleted = (fileName: string) => {
  return `Import process for ${fileName} completed.`;
};

export const migrationHomeBannerText = (timeStamp: string) => {
  return `You have some non-migrated Inkling title(s). Proceed to Migration Settings page if you want to add them to your library. Please note, that you can perform any action until ${timeStamp}, 00:00 (GMT), after that, the non-migrated titles will become unavailable. Contact Customer Support (opens in a new window) if you need additional assistance.`;
};
export const migrationSettingsBannerText = (timeStamp: string) => {
  return `Please note, that you can perform any action until ${timeStamp}, 00:00 (GMT), after that, the non-migrated titles will become unavailable. Contact Customer Support (opens in a new window) if you need additional assistance.`;
};

export interface OccupationOption {
  id: string;
  labelEn: string;
  labelHi: string;
  iconName: string;
  descriptionEn: string;
  descriptionHi: string;
  examplesEn: string;
  examplesHi: string;
}

export const OCCUPATIONS: OccupationOption[] = [
  {
    id: 'construction_worker',
    labelEn: 'Construction & Building Worker',
    labelHi: 'निर्माण मजदूर व मिस्त्री',
    iconName: 'Hammer',
    descriptionEn: 'Masonry, plastering, plumbing, painting, carpentry, bricklaying, site labour',
    descriptionHi: 'राजमिस्त्री, बेलदार, पेंटर, बढ़ई, प्लंबर, पत्थर घिसाई, ईंट भट्ठा कामगार',
    examplesEn: 'BoCW board registration eligible',
    examplesHi: 'भवन निर्माण कल्याण बोर्ड के पात्र'
  },
  {
    id: 'street_vendor',
    labelEn: 'Street Vendor & Hawker',
    labelHi: 'रेहड़ी-पटरी व ठेला विक्रेता',
    iconName: 'ShoppingBag',
    descriptionEn: 'Fruit/vegetable cart, tea/snack stall, street retail, mobile hawker',
    descriptionHi: 'सब्जी/फल ठेला, चाय-नाश्ता दुकान, फेरीवाला, फुटपाथ विक्रेता',
    examplesEn: 'PM SVANidhi micro-loan eligible',
    examplesHi: 'पीएम स्वनिधि ऋण के पात्र'
  },
  {
    id: 'domestic_worker',
    labelEn: 'Domestic Worker & Cook',
    labelHi: 'घरेलू कामगार व रसोइया',
    iconName: 'Home',
    descriptionEn: 'Housekeeper, cook, cleaner, babysitter, home caregiver, gardener',
    descriptionHi: 'झाड़ू-पोछा, खाना बनाने वाले, दाई, केयरगिवर, माली',
    examplesEn: 'e-Shram & social pension eligible',
    examplesHi: 'ई-श्रम व सामाजिक पेंशन के पात्र'
  },
  {
    id: 'delivery_gig',
    labelEn: 'Driver, Delivery & Gig Worker',
    labelHi: 'ड्राइवर, डिलीवरी व गिग वर्कर',
    iconName: 'Truck',
    descriptionEn: 'Auto-rickshaw/cab driver, delivery partner, courier, platform worker',
    descriptionHi: 'ऑटो/टैक्सी चालक, ई-रिक्शा, फूड व पार्सल डिलीवरी, प्लेटफॉर्म कामगार',
    examplesEn: 'Accident & life cover eligible',
    examplesHi: 'दुर्घटना व जीवन बीमा के पात्र'
  },
  {
    id: 'agricultural',
    labelEn: 'Agricultural Labourer & Farmer',
    labelHi: 'कृषि मजदूर व लघु किसान',
    iconName: 'Sprout',
    descriptionEn: 'Farm worker, field hand, harvester, animal husbandry, allied farm helper',
    descriptionHi: 'खेत मजदूर, फसल कटाई, पशुपालन सहायक, बटाईदार',
    examplesEn: 'Central social security eligible',
    examplesHi: 'केंद्रीय सामाजिक सुरक्षा के पात्र'
  },
  {
    id: 'daily_wage',
    labelEn: 'Daily Wage Helper & Loader',
    labelHi: 'दैनिक दिहाड़ी मजदूर व पल्लेदार',
    iconName: 'Package',
    descriptionEn: 'Mandi porter, warehouse loader, scrap worker, factory daily wage hand',
    descriptionHi: 'मंडी पल्लेदार, गोदाम लोडर, कबाड़ी, बाजार कुली, दिहाड़ी सहायक',
    examplesEn: 'Accident relief & pension eligible',
    examplesHi: 'दुर्घटना सहायता व पेंशन के पात्र'
  },
  {
    id: 'tailor_artisan',
    labelEn: 'Artisan, Tailor & Craft Worker',
    labelHi: 'कारीगर, दर्जी व हस्तशिल्प कामगार',
    iconName: 'Scissors',
    descriptionEn: 'Tailor, weaver, potter, cobbler, blacksmith, handicraft worker',
    descriptionHi: 'सिलाई-कढ़ाई, बुनकर, कुम्हार, मोची, लोहार, मूर्तिकार',
    examplesEn: 'e-Shram & micro-insurance eligible',
    examplesHi: 'ई-श्रम व सूक्ष्म बीमा के पात्र'
  },
  {
    id: 'other',
    labelEn: 'Other Informal & Self-Employed',
    labelHi: 'अन्य असंगठित व स्वरोजगार कामगार',
    iconName: 'UserCheck',
    descriptionEn: 'Barber, washerman (dhobi), sanitation worker, repair mechanic, security guard',
    descriptionHi: 'नाई, धोबी, सफाई कर्मी, मैकेनिक, सुरक्षा गार्ड, अन्य स्वतंत्र कामगार',
    examplesEn: 'General welfare safety nets',
    examplesHi: 'सामान्य कल्याणकारी योजनाएं'
  }
];

export const STATES_AND_UTS = [
  'All India (Central Schemes)',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

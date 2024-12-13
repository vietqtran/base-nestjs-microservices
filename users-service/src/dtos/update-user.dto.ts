export class UpdateUserDto {
  id: string;
  payload: {
    avatar?: {
      url?: string;
      key?: string;
    };
    settings?: {
      theme?: 'light' | 'dark' | 'system';
      dateFormat?: 'dd.mm.yyyy' | 'mm.dd.yyyy' | 'yyyy.mm.dd';
      language?: 'en' | 'vi' | 'ja' | 'cn';
    };
    profile?: {
      first_name?: string;
      last_name?: string;
      middle_name?: string;
      phone_number?: string;
      phone_code?: string;
      bio?: string;
      gender?: 'male' | 'female' | 'other';
      address?: {
        country?: string;
        country_code?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        address_line_1?: string;
        address_line_2?: string;
      };
    };
    roles?: string[];
  };
}

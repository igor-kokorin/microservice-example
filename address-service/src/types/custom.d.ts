interface IAddressService {
  getCityAddressById(cityKladrId: string): Promise<any>;
}

interface GetAddressRequestBody {
  query: string;
}

interface IDadataUtil {
  post(dadataPath: string, requestBody: GetAddressRequestBody): Promise<any>;
}


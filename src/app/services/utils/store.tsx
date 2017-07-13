import AAA from 'services/aaa';
import Configurations from 'config';

enum UrlType {
  View = 0,
  Download = 1,
}

class Store {
  public static getViewUrl(id: string) {
    return Store.getUrl(id, UrlType.View);
  }

  public static getDownloadUrl(id: string) {
    return Store.getUrl(id, UrlType.Download);
  }

  private static getUrl(id: string, type: UrlType) {
    const sessionKey = AAA.getInstance().getCredentials().sk;
    switch (type) {
      case UrlType.Download:
        return `${Configurations.STORE.URL}/view/${sessionKey}/${id}/`;
      default:
        return `${Configurations.STORE.URL}/download/${sessionKey}/${id}/`;
    }
  }

}

export default Store;

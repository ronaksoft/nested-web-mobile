import SearchConst from './CSearchPrefix';
import * as _ from 'lodash';

const locale = 'en-US';
const QUERY_SEPARATOR = ' ';
export default class Search {

  private order: number = 0;
  private places: any[] = [];
  private users: any[] = [];
  private labels: any[] = [];
  private tos: any[] = [];
  private otherKeywords: any[] = [];
  private before: number;
  private after: number;
  private subject: string;
  private hasAttachment: boolean;
  private within: string;
  private date: string;
  private app: any = null;
  private prefixes: any;
  private prefixLocale: any;

  private constructor() {
    if (locale === 'en-US') {
      this.prefixLocale.user = SearchConst.USER;
      this.prefixLocale.place = SearchConst.PLACE;
      this.prefixLocale.label = SearchConst.LABEL;
      this.prefixLocale.to = SearchConst.TO;
      this.prefixLocale.app = SearchConst.APP;
    } else {
      this.prefixLocale.user = SearchConst.USER_FA;
      this.prefixLocale.place = SearchConst.PLACE_FA;
      this.prefixLocale.label = SearchConst.LABEL_FA;
      this.prefixLocale.to = SearchConst.TO_FA;
      this.prefixLocale.app = SearchConst.APP_FA;
    }
  }

  public setQuery(query: string, secondaryQuery: string) {
    let secondaryResult = {
      places: [],
      users: [],
      labels: [],
      keywords: [],
      tos: [],
    };

    this.prefixes = {
      user: SearchConst.USER,
      place: SearchConst.PLACE,
      label: SearchConst.LABEL,
      to: SearchConst.TO,
      subject: SearchConst.SUBJECT,
      attachment: SearchConst.ATTACHMENT,
      within: SearchConst.WITHIN,
      date: SearchConst.DATE,
      app: SearchConst.APP,
    };

    if (locale === 'en-US') {
      query = this.transformLocale(query);
      if (secondaryQuery !== null && secondaryQuery !== undefined) {
        secondaryQuery = this.transformLocale(secondaryQuery);
      }
    }

    this.order = 0;

    const result = this.parseQuery(query);
    if ((secondaryQuery !== null && secondaryQuery !== undefined) && secondaryQuery.length > 0) {
      secondaryResult = this.parseQuery(secondaryQuery);
    }

    Array.prototype.concat(result.places, secondaryResult.places).forEach((item) => {
      this.addPlace(item.id, item.order);
    });

    Array.prototype.concat(result.users, secondaryResult.users).forEach((item) => {
      this.addUser(item.id, item.order);
    });

    Array.prototype.concat(result.labels, secondaryResult.labels).forEach((item) => {
      this.addLabel(item.id, item.order);
    });

    Array.prototype.concat(result.tos, secondaryResult.tos).forEach((item) => {
      this.addTo(item.id, item.order);
    });

    this.subject = result.subject;
    this.hasAttachment = result.hasAttachment;
    this.within = result.within;
    this.date = result.date;
    this.app = result.app;

    if (secondaryQuery !== null && secondaryQuery !== undefined) {
      secondaryResult.keywords.forEach((item) => {
        this.addOtherKeyword(item.id, item.order);
      });
    } else {
      result.keywords.forEach((item) => {
        this.addOtherKeyword(item.id, item.order);
      });
    }
  }

  public transformLocale(str: string) {
    str = str || '';
    const userRe = new RegExp(this.prefixLocale.user, 'g');
    const placeRe = new RegExp(this.prefixLocale.place, 'g');
    const labelRe = new RegExp(this.prefixLocale.label, 'g');
    const toRe = new RegExp(this.prefixLocale.to, 'g');

    str = str.replace(userRe, this.prefixes.user);
    str = str.replace(placeRe, this.prefixes.place);
    str = str.replace(labelRe, this.prefixes.label);
    str = str.replace(toRe, this.prefixes.to);

    return str;
  }

  public toString() {
    const items = this.getSortedParams();
    const stringList = [];
    items.forEach((item) => {
      if (item.type === 'place') {
        stringList.push(this.prefixes.place + item.id);
      } else if (item.type === 'user') {
        stringList.push(this.prefixes.user + item.id);
      } else if (item.type === 'label') {
        stringList.push(this.prefixes.label + '"' + item.id + '"');
      } else if (item.type === 'to') {
        stringList.push(this.prefixes.to + item.id);
      } else if (item.type === 'app') {
        stringList.push(this.prefixes.app + item.id);
      } else {
        stringList.push(item.id);
      }
    });

    return _.join(stringList, QUERY_SEPARATOR);
  };

  public toAdvancedString() {
    let query = this.toString();
    query += ' ';
    if (this.subject.length > 0) {
      query += this.prefixes.subject + '"' + this.subject + '" ';
    }
    if (this.hasAttachment) {
      query += this.prefixes.attachment + 'true ';
    }
    if (this.within.length > 0 && this.within !== '-1' && this.date.length > 0) {
      query += this.prefixes.within + '"' + this.within + '" ';
      query += this.prefixes.date + '"' + this.date + '"';
    }
    return query;
  };

  public parseQuery(query) {
    const places = [];
    const users = [];
    const labels = [];
    const tos = [];
    const keywords = [];
    let subject = '';
    let hasAttachment = false;
    let within = '1';
    let date = '';
    let app = '';
    const decodedQuery = decodeURIComponent(query);

    const words = [];
    const queryRegEx = /(\S([^[:|\s]+):\"([^"]+)")|(\"([^"]+)")|(\S+)/g;

    let match;
    do {
      match = queryRegEx.exec(decodedQuery);
      if (match) {
        words.push(match[0]);
      }
    } while (match);

    _.forEach(words, (word) => {
      this.order++;
      if (_.startsWith(word, this.prefixes.place)) {
        places.push({
          id: _.replace(word, this.prefixes.place, ''),
          order: this.order,
        });
      } else if (_.startsWith(word, this.prefixes.user)) {
        users.push({
          id: _.replace(word, this.prefixes.user, ''),
          order: this.order,
        });
      } else if (_.startsWith(word, this.prefixes.label)) {
        labels.push({
          id: _.trim(_.replace(word, this.prefixes.label, ''), '"'),
          order: this.order,
        });
      } else if (_.startsWith(word, this.prefixes.to)) {
        tos.push({
          id: _.replace(word, this.prefixes.to, ''),
          order: this.order,
        });
      } else if (_.startsWith(word, this.prefixes.subject)) {
        subject = _.trim(_.replace(word, this.prefixes.subject, ''), '"');
      } else if (_.startsWith(word, this.prefixes.attachment)) {
        hasAttachment = (_.replace(word, this.prefixes.attachment, '') === 'true');
      } else if (_.startsWith(word, this.prefixes.within)) {
        within = _.trim(_.replace(word, this.prefixes.within, ''), '"');
      } else if (_.startsWith(word, this.prefixes.date)) {
        date = _.trim(_.replace(word, this.prefixes.date, ''), '"');
      } else if (_.startsWith(word, this.prefixes.app)) {
        app = _.replace(word, this.prefixes.app, '');
      } else {
        if (word.length > 0) {
          keywords.push({
            id: word,
            order: this.order,
          });
        }
      }
    });

    return {
      places,
      users,
      labels,
      tos,
      keywords,
      subject,
      hasAttachment,
      within,
      date,
      app,
    };
  }

  public addPlace(place, order = null) {
    if (!this.checkValidity(place)) {
      return;
    }
    if (order === null) {
      order = ++this.order;
    }
    if (!_.find(this.places, {id: place})) {
      this.places.push({
        id: place,
        order,
      });
    }
  }

  public removePlace(place) {
    _.remove(this.places, (item) => {
      return place === item.id;
    });
  }

  public getDefaultPlaceId() {
    if (this.places.length > 0) {
      return this.places[0].id;
    } else {
      return null;
    }
  }

  public setPlaces(places) {
    places = places.replace(/, /g, ',');
    places = places.split(',');
    places.forEach((place) => {
      this.addPlace(place);
    });
  }

  public getPlaces() {
    return _.map(this.places, (item) => {
      return item.id;
    }).join(',');
  }

  public addUser(user, order = null) {
    if (!this.checkValidity(user)) {
      return;
    }
    if (order === null) {
      order = ++this.order;
    }
    if (!_.find(this.users, {id: user})) {
      this.users.push({
        id: user,
        order,
      });
    }
  }

  public removeUser(user) {
    _.remove(this.users, (item) => {
      return user === item.id;
    });
  }

  public setUsers(users) {
    users = users.replace(/, /g, ',');
    users = users.split(',');
    users.forEach((user) => {
      this.addUser(user);
    });
  }

  public getUsers() {
    return _.map(this.users, (item) => {
      return item.id;
    }).join(',');
  }

  public addLabel(label, order = null) {
    if (!this.checkValidity(label)) {
      return;
    }
    if (order === null) {
      order = ++this.order;
    }
    if (!_.find(this.labels, {id: label})) {
      this.labels.push({
        id: label,
        order,
      });
    }
  }

  public removeLabel(label) {
    _.remove(this.labels, (item) => {
      return label === item.id;
    });
  }

  public setLabels(labels) {
    labels = labels.replace(/, /g, ',');
    labels = labels.split(',');
    labels.forEach((label) => {
      this.addLabel(label);
    });
  }

  public getLabels() {
    return _.map(this.labels, (item) => {
      return item.id;
    }).join(',');
  }

  public addTo(user, order = null) {
    if (!this.checkValidity(user)) {
      return;
    }
    if (order === null) {
      order = ++this.order;
    }
    if (!_.find(this.tos, {id: user})) {
      this.tos.push({
        id: user,
        order,
      });
    }
  }

  public removeTo(user) {
    _.remove(this.tos, (item) => {
      return user === item.id;
    });
  }

  public setTos(users) {
    users = users.replace(/, /g, ',');
    users = users.split(',');
    users.forEach((user) => {
      this.addTo(user);
    });
  }

  public getTos() {
    return _.map(this.tos, (item) => {
      return item.id;
    }).join(',');
  }

  public addOtherKeyword(keyword, order = null) {
    if (!this.checkValidity(keyword)) {
      return;
    }
    if (order === null) {
      order = ++this.order;
    }
    if (!_.find(this.otherKeywords, {id: keyword})) {
      this.otherKeywords.push({
        id: keyword,
        order,
      });
    }
  }

  public removeKeyword(keyword) {
    _.remove(this.otherKeywords, (item) => {
      return keyword === item.id;
    });
  }

  public removeAllKeywords() {
    this.otherKeywords = [];
  }

  public setAllKeywords(keywords) {
    this.removeAllKeywords();
    this.addOtherKeyword(keywords);
  }

  public getAllKeywords() {
    return this.otherKeywords.map((item) => {
      return item.id;
    }).join(' ');
  }

  public setSubject(subject) {
    this.subject = subject;
  }

  public getSubject() {
    return this.subject;
  }

  public setHasAttachment(has) {
    this.hasAttachment = has;
  }

  public getHasAttachment() {
    return this.hasAttachment;
  }

  public setWithin(within) {
    this.within = String(within);
  }

  public getWithin() {
    return this.within;
  }

  public setDate(date) {
    this.date = String(date);
  }

  public getDate() {
    return this.date;
  }

  public setApp(app) {
    this.app = app;
  }

  public removeApp() {
    this.app = null;
  }

  public getApp() {
    return this.date;
  }

  public reset() {
    this.places = [];
    this.users = [];
    this.labels = [];
    this.tos = [];
    this.otherKeywords = [];
    this.before = null;
    this.after = null;
    this.app = null;
  }

  public encode(queryString) {
    return encodeURIComponent(queryString);
  }

  public getSearchParams() {
    if (this.date.length > 0 && this.within.length > 0) {
      this.before = parseInt(this.date, 10);
      this.after = parseInt(this.date, 19) - (parseInt(this.within, 10) * 36288000); // 7 * 24 * 60 * 60 * 60
    }
    return {
      places: _.map(this.places, (item) => {
        return item.id;
      }),
      users: _.map(this.users, (item) => {
        return item.id;
      }),
      labels: _.map(this.labels, (item) => {
        return item.id;
      }),
      tos: _.map(this.tos, (item) => {
        return item.id;
      }),
      keywords: _.map(this.otherKeywords, (item) => {
        return item.id;
      }),
      app: this.app,
      subject: this.subject,
      hasAttachment: this.hasAttachment,
      before: this.before * 1000,
      after: this.after * 1000,
    };
  };

  public getSortedParams() {
    const tempList = [];
    let i;
    for (i = 0; i < this.places.length; i++) {
      tempList.push({
        id: this.places[i].id,
        order: this.places[i].order,
        type: 'place',
      });
    }

    for (i = 0; i < this.users.length; i++) {
      tempList.push({
        id: this.users[i].id,
        order: this.users[i].order,
        type: 'user',
      });
    }

    for (i = 0; i < this.labels.length; i++) {
      tempList.push({
        id: this.labels[i].id,
        order: this.labels[i].order,
        type: 'label',
      });
    }

    for (i = 0; i < this.tos.length; i++) {
      tempList.push({
        id: this.tos[i].id,
        order: this.tos[i].order,
        type: 'to',
      });
    }

    if (this.app) {
      tempList.push({
        id: this.app,
        order: 0,
        type: 'app',
      });
    }

    for (i = 0; i < this.otherKeywords.length; i++) {
      tempList.push({
        id: this.otherKeywords[i].id,
        order: this.otherKeywords[i].order,
        type: 'keyword',
      });
    }

    tempList.sort((a, b) => {
      return (a.order < b.order ? -1 : 1);
    });

    return tempList;
  };

  public removeLastItem() {
    const items = this.getSortedParams();
    if (items.length > 0) {
      const item = items[items.length - 1];
      switch (item.type) {
        case 'place':
          this.removePlace(item.id);
          break;
        case 'user':
          this.removeUser(item.id);
          break;
        case 'label':
          this.removeLabel(item.id);
          break;
        case 'to':
          this.removeTo(item.id);
          break;
        case 'app':
          this.removeApp();
          break;
        case 'keyword':
          this.removeKeyword(item.id);
          break;
        default:
          break;
      }
    }
  };

  private checkValidity(text) {
    return (text !== undefined && text !== null && text.length !== 0);
  }
}

import * as React from 'react';
import { OptionsMenu } from 'components';
import {Input} from 'antd';

class Posts extends React.Component<any, any> {
  public sampleF = () => {
    console.log('nothing');
  }
  public render() {
    const leftItem = {
      name: 'feed',
      type: 'title',
      menu: [
        {
          onClick: this.sampleF,
          name: 'Posts',
          isChecked: true,
          icon: {
            name: 'message16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Files',
          isChecked: false,
          icon: {
            name: 'file16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Activity',
          isChecked: false,
          icon: {
            name: 'log16',
            size: 16,
          },
        },
        {
          onClick: this.sampleF,
          name: 'Members',
          isChecked: false,
          icon: {
            name: 'placeMember16',
            size: 16,
          },
        },
      ],
    };
    const RightItem = [
      {
        name: 'sort24',
        type: 'iconI',
        menu: [
          {
            onClick: this.sampleF,
            name: 'Sort',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'Latest Activity',
            isChecked: true,
          },
          {
            onClick: this.sampleF,
            name: 'Recent Posts',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'Filter',
            type: 'kind',
            isChecked: false,
          },
          {
            onClick: this.sampleF,
            name: 'All',
            isChecked: true,
          },
          {
            onClick: this.sampleF,
            name: 'Unseens',
            isChecked: false,
          },
        ],
      },
      {
        name: 'filter24',
        type: 'iconII',
        menu: [
          {
            onClick: this.sampleF,
            name: 'Place Settings',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Invite Members',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Create a Private Place',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
          {
            onClick: this.sampleF,
            name: 'Create a Common Place',
            isChecked: false,
            icon: {
              name: 'message16',
              size: 16,
            },
          },
        ],
      },
    ];
    return (
      <div>
        <OptionsMenu leftItem={leftItem} rightItems={RightItem} />
        <Input/>
      </div>
    );
  }
}

export { Posts }

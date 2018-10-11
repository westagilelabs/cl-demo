import React, { Component } from 'react';
import { TextInput } from 'react-desktop/macOs';
import { Button } from 'react-desktop/macOs';
import github from 'octonode';

export default class GithubScreen extends Component {
  handleChange = e => console.log(e.target.value);

  validateUrl = (e) => {
    // Validate URL - Check if the URL is a proper Github URL
    var urlValue = document.getElementById('githubUrl').value;
    console.log(urlValue);
    if(urlValue.trim().length == 0 || !urlValue.startsWith("https://github.com/")) {
      console.log("Please enter a valid Github URL.");
      return;
    }

    var client = github.client();

    client.get('/users/pksunkara', {}, function (err, status, body, headers) {
      //console.log(body); //json object
    });

    var ghrepo = client.repo('octokit/octokit.rb');
    ghrepo.prs({}, function (err, body, headers) {
      console.log(body); //json object
    })
  }

  getRepoInfo = () => {

  }

  render() {
    return (
      <div>
        <TextInput
          id="githubUrl"
          placeholder="Github URL"
          defaultValue=""
          onChange={this.handleChange}
          />
        <Button color="blue" onClick={this.validateUrl}>
          Analyze
        </Button>
      </div>
    );
  }
}

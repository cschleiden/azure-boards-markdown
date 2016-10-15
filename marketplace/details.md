# Markdown

**-- This extension is in early preview, please report any issues/suggestions at [https://github.com/cschleiden/vsts-markdown](https://github.com/cschleiden/vsts-markdown) or [cschleid@microsoft.com](mailto:cschleid@microsoft.com) --** 

__Markdown__ is a custom work item form control, that allows you to edit the rich text fields on your work items with a Markdown enabled editor.

## Features

### Headings, Links, Code Snippets, Lists

![Style elements](marketplace/features-styles.png)

### Auto grow based on content

__Markdown__ adjusts to the content when reading:

![Auto grow](marketplace/features-autosize.gif)

and editing:

![Auto grow](marketplace/features-autosize-edit.gif)

### Drag'n'Drop image upload

Easy drag and drop uploading: 

![Drag and drop images](marketplace/dnd-images.gif)

## How to: Install for VSTS 

You can follow the documentation for [VSTS](https://www.visualstudio.com/en-us/docs/work/process/custom-controls-process) or [TFS](https://www.visualstudio.com/en-us/docs/work/reference/weblayout-xml-elements#form-extensions). 

Here are some quick steps to get you started on VSTS:

### Step 1 

From an [inherited process](https://www.visualstudio.com/en-us/docs/work/process/manage-process#create-an-inherited-process), select the work item type you want to customize. Then, from the _Layout_ tab, add a custom control. For a _Feature_ it looks like this:

![Add custom control](marketplace/install1.png)

### Step 2: Select __Markdown__ control

Select the __Markdown__ control from the dropdown:

![Select Markdown control](marketplace/install2.png)

### Step 3: Configure __Markdown__ control

From the _Options_ tab, select the backing field. For example, _Description_:

![Configure Markdown control](marketplace/install3.png)
Optionally, you can customize the minimum and maximum  editor height.

### Step 4: Select _Markdown_ control

Place the control in a new group:
![Configure control group](marketplace/install4.png)

### Step 5: Hide existing group

Since we don't want two editors on the work item form, hide the existing Description group:
![Add custom control](marketplace/install5.png)

### Step 6: Use the __Markdown__ control

All done, since the layout is auto-saved just navigate to an existing or a new work item and the control will show up:
![Use Markdown editor](marketplace/install6.png)

## FAQ

### Q: When I start using _Markdown_ what happens to the existing HTML content in my work items?

**A**: __Markdown__ displays existing HTML content just fine. For editing, it detects whether content has been edited using an older editor and allows to convert existing HTML input to markdown, or to overwrite the changes. 

### Q: What happens with older clients when using _Markdown_?

**A**: __Markdown__ stores the original markdown input plus rendered HTML in the actual work item field. It's difficult to edit, but displaying should work fine in all supported clients:

![VS displaying Markdown edited content](marketplace/faq-vs.png)

## Version History

* **0.3.0** - First preview release

## Planned Features

* Pasting images
* Refer to [https://github.com/cschleiden/vsts-markdown/issues/](https://github.com/cschleiden/vsts-markdown/issues/) for an up-to-date list

# Code #
As always, the code is available at https://github.com/cschleiden/vsts-markdown.
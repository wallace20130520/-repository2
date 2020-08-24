package com.hybris.backoffice.workaround.ecp5193.widgets.itemcomments;

import com.hybris.backoffice.widgets.itemcomments.ItemCommentsController;
import com.hybris.backoffice.widgets.itemcomments.PopupPosition;
import de.hybris.platform.comments.model.CommentModel;
import de.hybris.platform.comments.model.CommentTypeModel;
import de.hybris.platform.comments.model.ComponentModel;
import de.hybris.platform.comments.model.DomainModel;
import de.hybris.platform.comments.services.CommentService;
import de.hybris.platform.core.model.ItemModel;
import de.hybris.platform.servicelayer.user.UserService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.zkoss.util.resource.Labels;
import org.zkoss.zk.ui.Component;
import org.zkoss.zk.ui.event.Event;
import org.zkoss.zk.ui.event.EventListener;
import org.zkoss.zk.ui.event.Events;
import org.zkoss.zk.ui.ext.Disable;
import org.zkoss.zk.ui.select.annotation.Wire;
import org.zkoss.zk.ui.select.annotation.WireVariable;
import org.zkoss.zk.ui.util.Clients;
import org.zkoss.zul.Button;
import org.zkoss.zul.Div;
import org.zkoss.zul.Label;
import org.zkoss.zul.Popup;
import org.zkoss.zul.Textbox;

import com.hybris.backoffice.widgets.notificationarea.NotificationService;
import com.hybris.backoffice.widgets.notificationarea.event.NotificationEvent;
import com.hybris.cockpitng.admin.CockpitMainWindowComposer;
import com.hybris.cockpitng.annotations.GlobalCockpitEvent;
import com.hybris.cockpitng.annotations.SocketEvent;
import com.hybris.cockpitng.annotations.ViewEvent;
import com.hybris.cockpitng.core.Executable;
import com.hybris.cockpitng.core.events.CockpitEvent;
import com.hybris.cockpitng.dataaccess.facades.object.ObjectFacade;
import com.hybris.cockpitng.dataaccess.facades.object.exceptions.ObjectCreationException;
import com.hybris.cockpitng.dataaccess.facades.object.exceptions.ObjectNotFoundException;
import com.hybris.cockpitng.dataaccess.facades.object.exceptions.ObjectSavingException;
import com.hybris.cockpitng.dataaccess.facades.permissions.PermissionFacade;
import com.hybris.cockpitng.dataaccess.facades.type.DataType;
import com.hybris.cockpitng.dataaccess.facades.type.TypeFacade;
import com.hybris.cockpitng.dataaccess.facades.type.exceptions.TypeNotFoundException;
import com.hybris.cockpitng.testing.annotation.InextensibleMethod;
import com.hybris.cockpitng.util.BackofficeSpringUtil;
import com.hybris.cockpitng.util.DefaultWidgetController;
import com.hybris.cockpitng.util.UITools;
import com.hybris.cockpitng.util.notifications.event.NotificationEventTypes;
import com.hybris.cockpitng.widgets.common.WidgetComponentRenderer;


public class ItemCommentsWorkaroundController extends DefaultWidgetController
{
    public static final String MODEL_DATE_FORMATTER = "dateFormatter";

    protected static final String SOCKET_IN_INPUT_ITEM = "inputItem";
    protected static final String SETTING_COMMENTS_LIST_RENDERER = "itemCommentsRenderer";
    protected static final String SETTING_POPUP_POSITION = "popupPosition";
    protected static final String SETTING_DATE_FORMAT = "dateFormat";
    protected static final String SETTING_DEFAULT_COMMENTS_LIST_RENDERER = "itemCommentsRenderer";
    protected static final String SETTING_DEFAULT_COMMENTS_DOMAIN = "domainCode";
    protected static final String SETTING_DEFAULT_COMMENTS_COMPONENT = "componentCode";
    protected static final String SETTING_DEFAULT_COMMENTS_COMMENT_TYPE = "commentTypeCode";

    /**
     * @deprecated since 1811, the field is unused
     */
    @Deprecated
    protected static final String COMPONENT_SHOW_POPUP_BUTTON = "showCommentsButton";

    /**
     * @deprecated since 1811, the field is unused
     */
    @Deprecated
    protected static final String COMPONENT_COMMENTS_COUNT_LABEL = "commentsCountLabel";
    protected static final String COMPONENT_ADD_COMMENT_BUTTON = "addCommentButton";

    protected static final String SCLASS_ADD_COMMENT_SECTION = "yw-add-comment-section";
    protected static final String SCLASS_ADD_COMMENT_SECTION_TEXTBOX = "yw-add-comment-section-textbox";
    protected static final String SCLASS_ADD_COMMENT_SECTION_BUTTON_OK = "yw-add-comment-section-button-ok";
    protected static final String SCLASS_ADD_COMMENT_SECTION_BUTTON_CANCEL = "yw-add-comment-section-button-cancel";
    protected static final String SCLASS_COMMENTS_LIST_EMPTY = "yw-commentslist-comment-empty";

    protected static final String LABEL_NO_COMMENTS = "comments.nocomments";

    protected static final String MODEL_DATA_TYPE = "dataType";
    protected static final String MODEL_COMMENTS = "comments";

    protected static final String MODEL_INPUT_ITEM = "inputItemModel";

    private static final String DEFAULT_DATE_FORMAT = "yyyy.MM.dd @ hh:mm";

    private static final String WRONG_ITEM_COMMENTS_SETTINGS = "WrongItemCommentsSettings";

    private static final String LOG_MSG_CANNOT_ADD_COMMENT = "Cannot add comment because of the wrong settings of the Item Comments widget.";

    private static final String LOG_MSG_CANNOT_FIND = "Unable to find a %s: %s";

    private static final String ITEM_COMMENTS = "item-comments";

    private static final Logger LOG = LoggerFactory.getLogger(ItemCommentsController.class);

    @Wire
    private Div commentsListContainer;
    @Wire
    private Button showCommentsButton;
    @Wire
    private Label commentsCountLabel;
    @Wire
    private Popup commentsPopup;
    @Wire
    private Button addCommentButton;
    @Wire
    private Div addCommentContainer;

    @WireVariable
    private transient ObjectFacade objectFacade;
    @WireVariable
    private transient TypeFacade typeFacade;
    @WireVariable
    private transient PermissionFacade permissionFacade;
    @WireVariable
    private transient UserService userService;
    @WireVariable
    private transient CommentService commentService;
    @WireVariable
    private transient NotificationService notificationService;

    private transient WidgetComponentRenderer<Div, Void, CommentModel> commentRenderer;

    private PopupPosition popupPosition = PopupPosition.BEFORE_START;

    @Override
    public void initialize(final Component component)
    {
        if (component == null)
        {
            LOG.error("Could not initialize controller because component == null.");
            return;
        }

        super.initialize(component);
        initDateFormatter();
        initPopupPosition();
        initRenderer();
        render();
    }

    @SocketEvent(socketId = SOCKET_IN_INPUT_ITEM)
    public void onInputItemReceive(final ItemModel inputItem)
    {
        if (inputItem != null)
        {
            ItemModel itemModelToProcess = null;
            try
            {
                itemModelToProcess = getObjectFacade().reload(inputItem);
            }
            catch (final ObjectNotFoundException e)
            {
                LOG.error("Unable to reload item", e);
            }
            if (itemModelToProcess == null)
            {
                itemModelToProcess = inputItem;
            }
            initDataType(itemModelToProcess);
            setValue(MODEL_INPUT_ITEM, itemModelToProcess);
            sortAndSetComments(itemModelToProcess.getComments());
        }
        else
        {
            setValue(MODEL_INPUT_ITEM, null);
            setValue(MODEL_COMMENTS, new ArrayList<CommentModel>());
        }

        render();
    }

    protected void scrollToLastComment()
    {
        Clients.scrollIntoView(getCommentsListContainer().getLastChild());
    }

    @ViewEvent(eventName = Events.ON_CLICK, componentID = COMPONENT_ADD_COMMENT_BUTTON)
    public void showNewCommentSection()
    {
        runWithReopeningPopup(() -> {
            final Textbox textbox = new Textbox();
            textbox.setMultiline(true);
            textbox.setSclass(SCLASS_ADD_COMMENT_SECTION_TEXTBOX);

            final Button okButton = new Button(Labels.getLabel("common.ok"));
            okButton.setSclass(SCLASS_ADD_COMMENT_SECTION_BUTTON_OK);

            final Button cancelButton = new Button(Labels.getLabel("common.cancel"));
            cancelButton.setSclass(SCLASS_ADD_COMMENT_SECTION_BUTTON_CANCEL);

            getAddCommentButton().setVisible(false);

            if (getAddCommentContainer() != null)
            {
                getAddCommentContainer().detach();
            }

            setAddCommentContainer(createAddCommentContainer(textbox, okButton, cancelButton));
            getCommentsPopup().appendChild(getAddCommentContainer());

            textbox.focus();
        });
    }

    @GlobalCockpitEvent(eventName = CockpitMainWindowComposer.HEARTBEAT_EVENT, scope = CockpitEvent.SESSION)
    public void onHeartbeat(final CockpitEvent cockpitEvent)
    {
        LOG.debug("Session-scoped heartbeat listener enabled");
        if (getInputItemModel() == null)
        {
            return;
        }

        runWithReopeningPopup(() -> {
            try
            {
                loadNewCommentsIfPossible();
            }
            catch (final ObjectNotFoundException e)
            {
                LOG.error("Unable to reload item", e);
            }
        });
    }

    public void openPopup()
    {
        getCommentsPopup().open(getShowCommentsButton(), popupPosition.getPosition());
        scrollToLastComment();
    }

    protected void loadNewCommentsIfPossible() throws ObjectNotFoundException
    {
        final ItemModel freshInputItemModel = getObjectFacade().reload(getInputItemModel());

        if (isCommentsChanged(freshInputItemModel))
        {
            setValue(MODEL_INPUT_ITEM, freshInputItemModel);
            sortAndSetComments(freshInputItemModel.getComments());
            render();
        }
    }

    protected void setOpenPopupAwareComponentsClickability()
    {
        final boolean isItemSelected = isItemSelected();

        for (final Component component : getOpenPopupAwareComponents())
        {
            setOnClickEventListenersForOpenPopupAwareComponent(component, isItemSelected);
            setUIStateForOpenPopupAwareComponent(component, isItemSelected);
        }
    }

    protected Collection<Component> getOpenPopupAwareComponents()
    {
        return Arrays.asList(getShowCommentsButton(), getCommentsCountLabel());
    }


    protected void setUIStateForOpenPopupAwareComponent(final Component component, final boolean clickable)
    {
        if (component instanceof Disable)
        {
            ((Disable) component).setDisabled(!clickable);
        }
        else
        {
            component.setVisible(clickable);
        }
    }

    protected void setOnClickEventListenersForOpenPopupAwareComponent(final Component component, final boolean clickable)
    {
        component.getEventListeners(Events.ON_CLICK)
                .forEach(eventListener -> component.removeEventListener(Events.ON_CLICK, eventListener));

        if (clickable)
        {
            component.addEventListener(Events.ON_CLICK, event -> openPopup());
        }
    }

    private boolean isItemSelected()
    {
        return getInputItemModel() != null;
    }

    protected boolean isCommentsChanged(final ItemModel freshInputItemModel)
    {
        final int oldNumberOfComments = getCommentsFromModel().size();
        final int newNumberOfComments = filterNotPermitted(freshInputItemModel.getComments()).size();
        return oldNumberOfComments != newNumberOfComments;
    }

    /**
     * Performs passed operation and closes and reopens comments popup so any modified elements in it will be recalculated
     * correctly. If popup was closed is not opened again (in case to call this method from
     * {@link #onHeartbeat(CockpitEvent)} )
     *
     * @param executable
     *           passed operation which will be executed before popup will be reopened.
     */
    protected void runWithReopeningPopup(final Executable executable)
    {
        final boolean shouldPopupBeReopened = getCommentsPopup().isVisible();
        closePopup();
        executable.execute();
        if (shouldPopupBeReopened)
        {
            openPopup();
        }
    }

    protected void closePopup()
    {
        getCommentsPopup().close();
    }

    protected Div createAddCommentContainer(final Textbox textbox, final Button okButton, final Button cancelButton)
    {
        final Div container = new Div();
        container.setSclass(SCLASS_ADD_COMMENT_SECTION);
        okButton.addEventListener(Events.ON_CLICK, createOkButtonEventListener(textbox));
        cancelButton.addEventListener(Events.ON_CLICK, createCancelButtonListener());
        container.appendChild(textbox);
        container.appendChild(okButton);
        container.appendChild(cancelButton);
        return container;
    }

    protected EventListener<Event> createOkButtonEventListener(final Textbox textbox)
    {
        return event -> {
            final Optional<CommentModel> optionalComment = createNewComment(textbox);
            runWithReopeningPopup(() -> {
                optionalComment.ifPresent(this::tryToSaveItemComment);
                getAddCommentContainer().setVisible(false);
                getAddCommentButton().setVisible(true);
            });
        };
    }

    protected EventListener<Event> createCancelButtonListener()
    {
        return event -> runWithReopeningPopup(() -> {
            getAddCommentContainer().setVisible(false);
            getAddCommentButton().setVisible(true);
        });
    }

    protected void tryToSaveItemComment(final CommentModel comment)
    {
        try
        {
            getObjectFacade().save(comment);
            addCommentToItem(comment);
        }
        catch (final ObjectSavingException exception)
        {
            handleCommentSavingException(exception);
        }
    }

    protected void handleCommentSavingException(final ObjectSavingException exception)
    {
        LOG.error(exception.getLocalizedMessage(), exception);
        getNotificationService().notifyUser(getWidgetInstanceManager(), NotificationEventTypes.EVENT_TYPE_GENERAL,
                com.hybris.cockpitng.util.notifications.event.NotificationEvent.Level.FAILURE, exception);
    }

    protected void addCommentToItem(final CommentModel newComment) throws ObjectSavingException
    {
        final List<CommentModel> comments = new ArrayList<>(getInputItemModel().getComments());
        comments.add(newComment);
        getInputItemModel().setComments(comments);
        getObjectFacade().save(getInputItemModel());
        sortAndSetComments(comments);
        render();
    }

    protected Optional<CommentModel> createNewComment(final Textbox textbox) throws ObjectCreationException
    {
        final String domainCode = getWidgetSettings().getString(SETTING_DEFAULT_COMMENTS_DOMAIN);
        final DomainModel domain = getCommentService().getDomainForCode(domainCode);

        if (domain == null)
        {
            return notifyAndReturnEmptyComment().apply(DomainModel._TYPECODE, domainCode);
        }

        final String componentCode = getWidgetSettings().getString(SETTING_DEFAULT_COMMENTS_COMPONENT);
        final ComponentModel component = getCommentService().getComponentForCode(domain, componentCode);

        if (component == null)
        {
            return notifyAndReturnEmptyComment().apply(CommentModel.COMPONENT, componentCode);
        }

        final String commentTypeCode = getWidgetSettings().getString(SETTING_DEFAULT_COMMENTS_COMMENT_TYPE);
        final CommentTypeModel commentType = getCommentService().getCommentTypeForCode(component, commentTypeCode);

        if (commentType == null)
        {
            return notifyAndReturnEmptyComment().apply(CommentModel.COMMENTTYPE, commentTypeCode);
        }

        return createNewComment(textbox.getText(), component, commentType);
    }

    @InextensibleMethod
    private BiFunction<String, String, Optional<CommentModel>> notifyAndReturnEmptyComment()
    {
        return ((incorrectSettingName, incorrectValue) -> {
            notifyUserOfWrongSettings(String.format(LOG_MSG_CANNOT_FIND, incorrectSettingName, incorrectValue));
            return Optional.empty();
        });
    }

    protected void notifyUserOfWrongSettings(final String wrongSettingsMessage)
    {
        String logMessage = LOG_MSG_CANNOT_ADD_COMMENT;
        if (!StringUtils.isBlank(wrongSettingsMessage))
        {
            logMessage = logMessage.concat(" ").concat(wrongSettingsMessage);
        }
        LOG.warn(logMessage);
        getNotificationService().notifyUser(ITEM_COMMENTS, WRONG_ITEM_COMMENTS_SETTINGS, NotificationEvent.Level.FAILURE);
    }

    protected Optional<CommentModel> createNewComment(final String text, final ComponentModel component,
                                                      final CommentTypeModel commentType) throws ObjectCreationException
    {
        final CommentModel newComment = getObjectFacade().create(CommentModel._TYPECODE);
        newComment.setAuthor(getUserService().getCurrentUser());
        newComment.setText(text);
        newComment.setCommentType(commentType);
        newComment.setComponent(component);
        newComment.setCode(UUID.randomUUID().toString());
        return Optional.of(newComment);
    }

    public ItemModel getInputItemModel()
    {
        return getValue(MODEL_INPUT_ITEM, ItemModel.class);
    }

    public List<CommentModel> getCommentsFromModel()
    {
        final List<CommentModel> comments = getValue(MODEL_COMMENTS, List.class);
        return comments != null ? comments : new ArrayList<>();
    }

    protected void render()
    {
        setOpenPopupAwareComponentsClickability();

        getCommentsCountLabel().setValue(Integer.toString(getCommentsFromModel().size()));
        if (!isItemSelected())
        {
            return;
        }

        disableAddCommentButtonIfNeeded();

        if (getCommentsListContainer() != null && getCommentRenderer() != null && getCommentsCountLabel() != null)
        {
            renderCommentsList();
            scrollToLastComment();
        }
    }

    private void disableAddCommentButtonIfNeeded()
    {
        addCommentButton.setDisabled(!canCreateComment());
    }

    protected void renderCommentsList()
    {
        getCommentsListContainer().getChildren().clear();
        renderContent();
    }

    protected void renderContent()
    {
        if (getCommentsFromModel().isEmpty())
        {
            renderEmptyMessage();
        }
        else
        {
            renderComments();
        }
    }

    protected void renderEmptyMessage()
    {
        UITools.addSClass(commentsListContainer, SCLASS_COMMENTS_LIST_EMPTY);
        getCommentsListContainer().appendChild(new Label(getLabel(LABEL_NO_COMMENTS)));
    }

    protected void renderComments()
    {
        UITools.removeSClass(commentsListContainer, SCLASS_COMMENTS_LIST_EMPTY);
        final DataType dataType = getValue(MODEL_DATA_TYPE, DataType.class);
        getCommentsFromModel().forEach(
                comment -> getCommentRenderer().render(commentsListContainer, null, comment, dataType, getWidgetInstanceManager()));
    }

    protected String getDefaultDateFormat()
    {
        return DEFAULT_DATE_FORMAT;
    }

    protected void initDataType(final ItemModel inputItem)
    {
        final String type = typeFacade.getType(inputItem);
        try
        {
            final DataType dataType = typeFacade.load(type);
            setValue(MODEL_DATA_TYPE, dataType);
        }
        catch (final TypeNotFoundException e)
        {
            LOG.error("Error loading type", e);
        }
    }

    protected void initDateFormatter()
    {
        final String retrievedDateFormat = getWidgetSettings().getString(SETTING_DATE_FORMAT);
        final String dateFormat = ObjectUtils.defaultIfNull(retrievedDateFormat, getDefaultDateFormat());
        SimpleDateFormat formatter;
        try
        {
            formatter = new SimpleDateFormat(dateFormat);
        }
        catch (final IllegalArgumentException e)
        {
            LOG.debug("Invalid date format, using default", e);
            formatter = new SimpleDateFormat(getDefaultDateFormat());
        }
        setValue(MODEL_DATE_FORMATTER, formatter);
    }

    protected void initRenderer()
    {
        final String rendererName = getWidgetSettings().getString(SETTING_COMMENTS_LIST_RENDERER);
        WidgetComponentRenderer<Div, Void, CommentModel> renderer = StringUtils.isNotEmpty(rendererName)
                ? BackofficeSpringUtil.getBean(rendererName)
                : null;

        if (renderer == null)
        {
            LOG.warn("Renderer {} not found, using default", rendererName);
            renderer = BackofficeSpringUtil.getBean(SETTING_DEFAULT_COMMENTS_LIST_RENDERER);
        }
        setCommentRenderer(renderer);
    }

    protected void initPopupPosition()
    {
        try
        {
            final String position = getWidgetSettings().getString(SETTING_POPUP_POSITION);
            popupPosition = PopupPosition.forName(ObjectUtils.defaultIfNull(position, popupPosition.getPosition()));
        }
        catch (final IllegalArgumentException e)
        {
            LOG.debug("Unrecognized popup position, using default value", e);
            popupPosition = PopupPosition.BEFORE_START;
        }
    }

    protected void sortAndSetComments(final List<CommentModel> comments)
    {
        if (comments != null)
        {
            final List<CommentModel> newComments = filterNotPermitted(comments);
            newComments.sort(createCommentModelReverseOrderDateComparator());
            setValue(MODEL_COMMENTS, newComments);
        }
    }

    protected List<CommentModel> filterNotPermitted(final List<CommentModel> comments)
    {
        return new ArrayList<>(comments.stream().filter(this::canReadThisComment).collect(Collectors.toList()));
    }

    protected boolean canReadThisComment(final CommentModel comment)
    {
        return permissionFacade.canReadInstance(comment);
    }

    protected boolean canCreateComment()
    {
        return permissionFacade.canCreateTypeInstance(CommentModel._TYPECODE)
                && permissionFacade.canChangeType(CommentModel._TYPECODE) && permissionFacade.canChangeInstance(getInputItemModel());
    }

    @InextensibleMethod
    private static Comparator<CommentModel> createCommentModelReverseOrderDateComparator()
    {
        return Comparator.nullsLast((c1, c2) -> {
            final Comparator<Date> dateComparator = Comparator.nullsLast(Date::compareTo);
            return dateComparator.compare(c1.getCreationtime(), c2.getCreationtime());
        });
    }

    public Div getCommentsListContainer()
    {
        return commentsListContainer;
    }

    public void setCommentsListContainer(final Div commentsListContainer)
    {
        this.commentsListContainer = commentsListContainer;
    }

    public Button getShowCommentsButton()
    {
        return showCommentsButton;
    }

    public void setShowCommentsButton(final Button showCommentsButton)
    {
        this.showCommentsButton = showCommentsButton;
    }

    public Label getCommentsCountLabel()
    {
        return commentsCountLabel;
    }

    public void setCommentsCountLabel(final Label commentsCountLabel)
    {
        this.commentsCountLabel = commentsCountLabel;
    }

    public PopupPosition getPopupPosition()
    {
        return popupPosition;
    }

    public void setPopupPosition(final PopupPosition popupPosition)
    {
        this.popupPosition = popupPosition;
    }

    public Popup getCommentsPopup()
    {
        return commentsPopup;
    }

    public void setCommentsPopup(final Popup commentsPopup)
    {
        this.commentsPopup = commentsPopup;
    }

    public Button getAddCommentButton()
    {
        return addCommentButton;
    }

    public void setAddCommentButton(final Button addCommentButton)
    {
        this.addCommentButton = addCommentButton;
    }

    public Div getAddCommentContainer()
    {
        return addCommentContainer;
    }

    public void setAddCommentContainer(final Div addCommentContainer)
    {
        this.addCommentContainer = addCommentContainer;
    }

    public ObjectFacade getObjectFacade()
    {
        return objectFacade;
    }

    public void setObjectFacade(final ObjectFacade objectFacade)
    {
        this.objectFacade = objectFacade;
    }

    public TypeFacade getTypeFacade()
    {
        return typeFacade;
    }

    public void setTypeFacade(final TypeFacade typeFacade)
    {
        this.typeFacade = typeFacade;
    }

    public UserService getUserService()
    {
        return userService;
    }

    public void setUserService(final UserService userService)
    {
        this.userService = userService;
    }

    public CommentService getCommentService()
    {
        return commentService;
    }

    public void setCommentService(final CommentService commentService)
    {
        this.commentService = commentService;
    }

    public WidgetComponentRenderer<Div, Void, CommentModel> getCommentRenderer()
    {
        return commentRenderer;
    }

    public void setCommentRenderer(final WidgetComponentRenderer<Div, Void, CommentModel> commentRenderer)
    {
        this.commentRenderer = commentRenderer;
    }

    public PermissionFacade getPermissionFacade()
    {
        return permissionFacade;
    }

    public void setPermissionFacade(final PermissionFacade permissionFacade)
    {
        this.permissionFacade = permissionFacade;
    }

    protected NotificationService getNotificationService()
    {
        return notificationService;
    }

    public void setNotificationService(final NotificationService notificationService)
    {
        this.notificationService = notificationService;
    }
}

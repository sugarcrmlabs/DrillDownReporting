<?php
class CustomCacheApi extends FilterApi
{
    public function registerApiRest()
    {
        return array(
            'customCacheSavePost' => array(
                'reqType' => 'POST',
                'path' => array('SaveFilterToCache'),
                'pathVars' => array(''),
                'method' => 'saveFilterToCache',
                'shortHelp' => 'Saves filter settings to cache to help in drill down reports.',
                'longHelp' => '',
            )
        );
    }

    public function saveFilterToCache(ServiceBase $api, array $args)
    {
        session_start();
        $myCache = array();
        $myCache['report'] = !empty($args['report_id']) ? $args['report_id'] : '';
        $myCache['filter'] = !empty($args['filter']) ? $args['filter'] : '';
        $_SESSION['my_filter'] = $myCache;
    }
}
<?php
class CustomFilterApi extends FilterApi
{
    public function filterListSetup(ServiceBase $api, array $args, $acl = 'list')
    {
        if (!empty($args['filter']) && isset($args['filter'][0]['$report'])) {
            session_start();
            $filterFromCache = $_SESSION['my_filter'];
            $newFilter = array();

            if (!empty($filterFromCache['report'])) {
                require_once("modules/Reports/Report.php");

                $savedReport = BeanFactory::getBean("Reports", $filterFromCache['report'], array("encode" => false));
                if (!empty($savedReport->content)) {
                    $results = $savedReport->runReportQuery();

                    $newFilter[0]['id']['$in'] = array();
                    foreach ($results as $record) {
                        if(isset($record['primaryid'])){
                            $newFilter[0]['id']['$in'][] = $record['primaryid'];
                        }
                    }
                }
            }

            if (!empty($filterFromCache['filter'])) {
                $tmpFilter = json_decode($filterFromCache['filter'], true);

                $newFilter = array_merge($newFilter, $tmpFilter);
            }

            $args['filter'] = $newFilter;
        }

        return parent::filterListSetup($api, $args, $acl);
    }
}